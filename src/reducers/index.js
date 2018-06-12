import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { types } from '../actions'

const orbit = (state = { isLoading: true }, action) => {
  switch (action.type) {
    case types.INIT_ORBIT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

const entities = combineReducers({
  threads: require('../models/threads').threads,
  uploads: require('../models/media').uploads
})

const views = combineReducers({
  threads: require('../models/threads').threadsView,
  uploads: require('../models/media').uploads
})

export default combineReducers({
  form: formReducer,
  orbit,
  entities,
  views,
})
