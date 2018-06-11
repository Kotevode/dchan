import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createHistory from 'history/createHashHistory'

import reducers from './reducers'
import rootSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware()
const routingMiddleware = routerMiddleware(history)

const store = createStore(
  connectRouter(history)(reducers),
  composeEnhancers(
    applyMiddleware(
      routingMiddleware,
      sagaMiddleware,
      loggerMiddleware,
    )
  )
)

sagaMiddleware.run(rootSaga)

export default store
