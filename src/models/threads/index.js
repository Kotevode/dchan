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
import { eventChannel } from 'redux-saga'
import { async, createTypes, actionCreator } from 'redux-action-creator'

// Types

export const types = createTypes([
  ...async('OPEN_THREAD'),
  ...async('ADD_POST'),
  ...async('CLOSE_THREAD'),
  ...async('CREATE_THREAD'),
  'RECEIVED_POSTS'
])

// Actions

export const actions = {
  createThread: actionCreator(types.CREATE_THREAD, 'name', 'post'),
  createThreadSuccess: actionCreator(types.CREATE_THREAD_SUCCESS, 'name', 'address'),
  createThreadFail: actionCreator(types.CREATE_THREAD_FAIL, 'name', 'error'),
  openThread: actionCreator(types.OPEN_THREAD, 'address'),
  openThreadSuccess: actionCreator(types.OPEN_THREAD_SUCCESS, 'address'),
  openThreadFail: actionCreator(types.OPEN_THREAD_FAIL, 'address', 'error'),
  addPost: actionCreator(types.ADD_POST, 'address', 'post'),
  addPostSuccess: actionCreator(types.ADD_POST_SUCCESS, 'hash', 'address'),
  addPostFail: actionCreator(types.ADD_POST_FAIL, 'error'),
  closeThread: actionCreator(types.CLOSE_THREAD, 'address'),
  closeThreadSuccess: actionCreator(types.CLOSE_THREAD_SUCCESS, 'address'),
  threadUpdated: actionCreator(types.RECEIVED_POSTS, 'address', 'posts')
}

// Reducers

export const threads = (state = {
  byName: {}
}, action) => {
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
    case types.CREATE_THREAD_SUCCESS:
      let { name } = action.payload
      return {
        ...state,
        [address]: {
          isLoading: false,
          posts: [],
          closed: false,
          address
        },
        byName: {
          ...state.byName,
          [name]: address
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
    case types.RECEIVED_POSTS:
      let { posts } = action.payload
      return {
        ...state,
        [address]: {
          ...state[address],
          posts: posts
        }
      }
    default:
      return state
  }
}

export const threadsView = (state = {
  selectedThread: null
}, action) => {
  switch (action.type) {
    case types.OPEN_THREAD_SUCCESS:
    case types.CREATE_THREAD_SUCCESS:
      let { address } = action.payload
      return {
        ...state,
        selectedThread: address
      }
    default:
      return state
  }
}

// Sagas

const openParams = {
  sync: true,
}

const createParams = {
  create: true,
  overwrite: true,
  localOnly: false,
  type: 'feed',
  write: [ '*' ]
}

export const dbEvents = [
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
  const requestChan = yield actionChannel(action => (
    action.type === types.ADD_POST &&
    action.payload.address === `${thread.address}`
  ))
  while (true) {
    let action = yield take(requestChan)
    yield call(addPost, thread, action)
  }
}

export function* updateThread(thread){
  let posts = thread.iterator({ limit: -1 })
    .collect()
  yield put(actions.threadUpdated(`${thread.address}`, posts))
}

const createEventChannel = thread => eventChannel(emitter => {
  dbEvents.forEach(event => {
    thread.events.on(event, () => {
      emitter(event)
    })
  })
  return () => {
    thread.events.removeAllListeners()
  }
})

export function *watchUpdate(thread, eventChan) {
  try {
    while (true) {
      yield take(eventChan)
      yield call(updateThread, thread)
    }
  } finally {
  }
}

export function* watchAll(thread) {
  const eventChan = yield call(createEventChannel, thread)
  yield all ([
    watchUpdate(thread, eventChan),
    watchAddPost(thread)
  ])
}

export function* serveThread(thread) {
  let address = thread.address.toString()
  let watchSaga = yield fork(watchAll, thread)
  yield take(action => (
    action.type === types.CLOSE_THREAD &&
    action.payload.address === address
  ))
  yield cancel(watchSaga)
  yield apply(thread, thread.close)
  yield put(actions.closeThreadSuccess(address))
}

export function* openThread(orbitdb, { payload: { address }}) {
  try {
    let thread = yield apply(orbitdb, orbitdb.open, [
      address, openParams
    ])
    yield fork(serveThread, thread)
    yield apply(thread, thread.load)
    yield put(actions.openThreadSuccess(address))
  } catch (error) {
    yield put(actions.openThreadFail(address, error))
  }
}

export function* createThread(orbitdb, { payload: { name, post }}) {
  try {
    name = encodeURIComponent(name)
    let thread = yield apply(orbitdb, orbitdb.open, [
      name, createParams
    ])
    yield fork(serveThread, thread)
    yield apply(thread, thread.load)
    if (post) {
      yield apply(thread, thread.add, [ post ])
    }
    yield put(actions.createThreadSuccess(name, thread.address.toString()))
  } catch (error) {
    yield put(actions.createThreadFail(name, error))
  }
}
