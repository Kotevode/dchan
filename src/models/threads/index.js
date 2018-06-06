import {
  apply,
  all,
  put,
  fork,
  call,
  actionChannel,
  take,
  cancel
} from 'redux-saga/effects'
import { async, createTypes, actionCreator } from 'redux-action-creator'

// Types

export const types = createTypes([
  ...async('OPEN_THREAD'),
  ...async('ADD_POST'),
  ...async('CLOSE_THREAD')
])

// Actions

export const actions = {
  openThread: actionCreator(types.OPEN_THREAD, 'address'),
  openThreadSuccess: actionCreator(types.OPEN_THREAD_SUCCESS, 'address'),
  openThreadFail: actionCreator(types.OPEN_THREAD_FAIL, 'address', 'error'),
  addPost: actionCreator(types.ADD_POST, 'post'),
  addPostSuccess: actionCreator(types.ADD_POST_SUCCESS, 'hash', 'address'),
  addPostFail: actionCreator(types.ADD_POST_FAIL, 'error'),
  closeThread: actionCreator(types.CLOSE_THREAD, 'address'),
  closeThreadSuccess: actionCreator(types.CLOSE_THREAD_SUCCESS, 'address')
}

// Reducers

export const threads = (state = {}, action) => {
  if (!action.payload)
    return state
  let { address } = action.payload
  switch (action.type) {
    case types.OPEN_THREAD:
      return {
        ...state,
        [address]: {
          ...state[address],
          isLoading: true
        }
      }
    case types.OPEN_THREAD_FAIL:
    let { error } = action.payload
      return {
        ...state,
        [address]: {
          ...state[address],
          isLoading: false,
          error: error
        }
      }
    case types.OPEN_THREAD_SUCCESS:
      return {
        ...state,
        [address]: {
          address,
          isLoading: false,
          posts: [],
          closed: false
        }
      }
    case types.CLOSE_THREAD_SUCCESS:
      return {
        ...state,
        [address]: {
          ...state[address],
          closed: true
        }
      }
    default:
      return state
  }
}

// Sagas

const openParams = {
  sync: true
}

export function updateThread() {

}

const dbEvents = [
  'ready',
  'write',
  'replicated'
]

export function* addPost(thread, { payload: { post }}) {
  try {
    let hash = yield apply(thread, thread.add, [ post ])
    let address = thread.address.toString()
    yield put(actions.addPostSuccess(hash, address))
  } catch (error) {
    yield put(actions.addPostFail(error))
  }
}

export function *watchAddPost(thread) {
  const requestChan = yield actionChannel(types.ADD_POST)
  while (true) {
    let action = yield take(requestChan)
    yield call(addPost, thread, action)
  }
}

export function* watchAll(thread) {
  yield all ([
    watchAddPost(thread)
  ])
}

export function* serveThread(thread) {
  let watchSaga = yield fork(watchAll)
  yield take(action => (
    action.type === types.CLOSE_THREAD &&
    action.payload.address === thread.address
  ))
  yield cancel(watchSaga)
  yield apply(thread, thread.close)
  yield put(actions.closeThreadSuccess(thread.address))
}

export function* loadThread(thread) {
  dbEvents.forEach(event => {
    thread.events.on(event, () => updateThread(thread))
  })
  yield apply(thread, thread.load)
}

export function* openThread(orbitdb, { payload: { address }}) {
  try {
    let thread = yield apply(orbitdb, orbitdb.open, [
      address, openParams
    ])
    yield call(loadThread, thread)
    yield put(actions.openThreadSuccess(address))
    let serving = yield fork(serveThread, thread)
  } catch (error) {
    yield put(actions.openThreadFail(address, error))
  }
}
