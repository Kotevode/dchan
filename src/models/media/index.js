import { put, cps } from 'redux-saga/effects'
import { createTypes, actionCreator, async } from 'redux-action-creator'

// Action types

export const types = createTypes([
  ...async('UPLOAD_MEDIA')
])

// Actions

export const actions = {
  uploadMedia: actionCreator(types.UPLOAD_MEDIA, 'name', 'buffer'),
  uploadMediaSuccess: actionCreator(types.UPLOAD_MEDIA_SUCCESS, 'name', 'hash'),
  uploadMediaFail: actionCreator(types.UPLOAD_MEDIA_FAIL, 'name', 'error')
}

// Reducers

export const uploads = (state = {}, action) => {
  switch (action.type) {
    case types.UPLOAD_MEDIA_SUCCESS:
      let { name, hash } = action.payload
      return {
        ...state,
        [name]: hash
      }
    default:
      return state
  }
}

const uploadMedia = (state, { payload: { name }}) => ({
  ...state,
  [name]: {
    ...state[name],
    isUploading: true
  }
})

const uploadMediaSuccess = (state, { payload: { name }}) => ({
  ...state,
  [name]: {
    ...state[name],
    isUploading: false
  }
})

const uploadMediaFail = (state, { payload: { name, error }}) => ({
  ...state,
  [name]: {
    ...state[name],
    isUploading: false,
    error
  }
})

export const uploadsView = (state = {}, action) => {
  switch (action.type) {
    case types.UPLOAD_MEDIA:
      return uploadMedia(state, action)
    case types.UPLOAD_MEDIA_SUCCESS:
      return uploadMediaSuccess(state, action)
    case types.UPLOAD_MEDIA_FAIL:
      return uploadMediaFail(state, action)
    default:
      return state
  }
}

// Sagas

export function* upload(ipfs, action) {
  let { name, buffer } = action.payload
  try {
    let results = yield cps([ipfs.files, ipfs.files.add], buffer)
    let hash = results[0].hash
    yield put(actions.uploadMediaSuccess(name, hash))
  } catch (error) {
    yield put(actions.uploadMediaFail(name, error))
  }
}
