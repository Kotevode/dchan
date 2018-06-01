import { take, all, apply, put } from 'redux-saga/effects'
import OrbitDB from 'orbit-db'

import store from '../store'
import { types } from '../actions'
import Thread , { actions } from '../models/Thread'


export function* openThread(orbitdb, { address }) {

}

export function* createThread(orbitdb, { name }) {
  let thread = new Thread(store, orbitdb)
  yield apply(thread, thread.init, [ name ])
  var closed = false
  while (!closed) {
    let action = yield take([
      actions.types.THREAD_UPDATED,
      actions.types.CLOSE_THREAD,
      actions.types.POST
    ])
    debugger

    switch (action.type) {
      case actions.types.CLOSE_THREAD:
        thread.close()
        closed = true
        break
      case actions.types.THREAD_UPDATED:
        console.log("Thread updated")
        break
      case actions.types.POST:
        let { post } = action.payload
        yield apply(thread, thread.post, [ post ])
        break
      default:
        throw 'WTF'
    }

  }
}

export function* threadSaga() {
  console.log("Waiting for orbit")
  let { payload: ipfs } = yield take(types.INIT_IPFS_SUCCESS)
  console.log(ipfs)
  const orbitdb = new OrbitDB(ipfs)
  yield put({
    type: types.INIT_ORBIT_SUCCESS
  })
  while(true) {
    let action = yield take([
      types.OPEN_THREAD,
      types.CREATE_THREAD,
    ])

    debugger

    switch (action.type) {
      case types.OPEN_THREAD:
        yield* openThread(orbitdb, action.payload)
        break
      case types.CREATE_THREAD:
        yield* createThread(orbitdb, action.payload)
        break
      default:
        throw 'How the fuck did you passed it?!?!?!?!'
    }
  }
}

 export default function* rootSaga() {
   yield all([
     threadSaga()
   ])
 }
