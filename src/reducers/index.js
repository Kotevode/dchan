import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { actions as threadActions } from '../models/Thread'
import { types } from '../actions'

console.log(threadActions)

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

export default combineReducers({
  form: formReducer,
  orbit
})
