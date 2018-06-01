import { createTypes, async, actionCreator } from 'redux-action-creator'

export const types = createTypes([
  ...async('INIT_IPFS'),
  ...async('INIT_ORBIT'),
  ...async('OPEN_THREAD'),
  ...async('CREATE_THREAD')
])

export default {
  ipfsInitialized: actionCreator(types.INIT_IPFS_SUCCESS, 'ipfs'),
  orbitInitialized: actionCreator(types.INIT_ORBIT_SUCCESS, 'orbit'),
  openThread: actionCreator(types.OPEN_THREAD, 'name'),
  createThread: actionCreator(types.CREATE_THREAD, 'name')
}
