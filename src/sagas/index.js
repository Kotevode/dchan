import { takeEvery, take, put, all, call, fork } from 'redux-saga/effects'
import OrbitDB from 'orbit-db'
import OrbitDbAddress from 'orbit-db/src/orbit-db-address'
import { push } from 'connected-react-router'

import store from '../store'
import actions, { types } from '../actions'
import { types as threadTypes, createThread, openThread } from '../models/threads'

const chopAddress = (address) => {
  return address.replace("/orbitdb/", "")
}

export function* watchCreateThread(orbit) {
  while(true) {
    let action = yield take(threadTypes.CREATE_THREAD)
    let address = yield* createThread(orbit, action)
    if (address) {
      yield put(push(`/threads/${chopAddress(address)}`))
    }
  }
}

export function* watchOpenThread(orbit) {
  yield takeEvery(threadTypes.OPEN_THREAD, openThread, orbit)
}

export function* watchAll(orbitdb) {
  yield all([
    watchOpenThread(orbitdb),
    watchCreateThread(orbitdb)
  ])
}

export default function* rootSaga() {
  let { payload: ipfs } = yield take(types.INIT_IPFS_SUCCESS)
  const orbitdb = new OrbitDB(ipfs)
  yield fork(watchAll, orbitdb)
  yield put({
    type: types.INIT_ORBIT_SUCCESS
  })
 }
