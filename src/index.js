import React from 'react'
import ReactDOM from 'react-dom'
import IPFS from 'ipfs'
import { Provider } from 'react-redux'
import OrbitDB from 'orbit-db'
// import 'orbit-db/dist/orbit-db.min.js'

import App from './App'
import { types } from './actions'
import store from './store'
import ipfsConfig from './ipfsConfig'

const ipfs = new IPFS(ipfsConfig)

ipfs.on('ready', () => {
  store.dispatch({
    type: types.INIT_IPFS_SUCCESS,
    payload: ipfs
  })
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
