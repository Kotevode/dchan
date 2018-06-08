import { takeEvery, take, put, all } from 'redux-saga/effects'
import OrbitDB from 'orbit-db'
import OrbitDbAddress from 'orbit-db/src/orbit-db-address'

import store from '../store'
import actions, { types } from '../actions'
import { types as threadTypes, createThread, openThread } from '../models/threads'

export function* watchCreateThread(orbit) {
  yield takeEvery(threadTypes.CREATE_THREAD, createThread, orbit)
}

export function* watchOpenThread(orbit) {
  yield takeEvery(threadTypes.OPEN_THREAD, openThread, orbit)
}

export default function* rootSaga() {
  let { payload: ipfs } = yield take(types.INIT_IPFS_SUCCESS)
  const orbitdb = new OrbitDB(ipfs)
  yield put({
    type: types.INIT_ORBIT_SUCCESS
  })
  yield all([
    watchOpenThread(orbitdb),
    watchCreateThread(orbitdb)
  ])
 }
