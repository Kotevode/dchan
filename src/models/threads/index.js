import { apply, put, call } from 'redux-saga/effects'
import { async, createTypes, actionCreator } from 'redux-action-creator'

// Types

export const types = createTypes([
  ...async('OPEN_THREAD')
])

// Actions

export const actions = {
  openThread: actionCreator(types.OPEN_THREAD, 'address'),
  openThreadSuccess: actionCreator(types.OPEN_THREAD_SUCCESS, 'address')
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

export function* serveThread(thread) {
  yield true
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
