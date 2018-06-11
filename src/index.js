import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import IPFS from 'ipfs'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import App from './App'
import { types } from './actions'
import store, { history } from './store'
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
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
