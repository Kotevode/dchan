import { apply, all, put, call, actionChannel, take } from 'redux-saga/effects'
import { async, createTypes, actionCreator } from 'redux-action-creator'

// Types

export const types = createTypes([
  ...async('OPEN_THREAD'),
  ...async('ADD_POST')
])

// Actions

export const actions = {
  openThread: actionCreator(types.OPEN_THREAD, 'address'),
  openThreadSuccess: actionCreator(types.OPEN_THREAD_SUCCESS, 'address'),
  addPost: actionCreator(types.ADD_POST, 'post'),
  addPostSuccess: actionCreator(types.ADD_POST_SUCCESS, 'hash', 'address'),
  addPostFail: actionCreator(types.ADD_POST_FAIL, 'error')
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

export function* serveThread(thread) {
  yield all([
    watchAddPost(thread)
  ])
}

export function* loadThread(thread) {
  dbEvents.forEach(event => {
    thread.events.on(event, () => updateThread(thread))
  })
  yield apply(thread, thread.load)
}

export function* openThread(orbitdb, { payload: { address }}) {
  const thread = yield apply(orbitdb, orbitdb.open, [
    address, openParams
  ])
  yield call(loadThread, thread)
  yield put(actions.openThreadSuccess(address))
  yield call(serveThread, thread)
}
