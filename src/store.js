import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import reducers from './reducers'
import rootSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware,
      loggerMiddleware
    )
  )
)

sagaMiddleware.run(rootSaga)

export default store
