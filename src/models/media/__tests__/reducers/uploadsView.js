import { uploadsView, actions } from '../..'

describe('media#uploadsView', () => {
  const name = "some_name"

  describe('when UPLOAD_MEDIA dispatched', () => {
    const action = actions.uploadMedia(name)

    it('sets isUploading to true', () => {
      let state = uploadsView(undefined, action)

      expect(state[name].isUploading).toEqual(true)
    })
  })

  describe('when UPLOAD_MEDIA_SUCCESS dispatched', () => {
    const action = actions.uploadMediaSuccess(name)

    it('sets isUploading to false', () => {
      let state = uploadsView(undefined, action)

      expect(state[name].isUploading).toEqual(false)
    })
  })

  describe('when UPLOAD_MEDIA_FAIL dispatched', () => {
    const error = new Error('WTF')
    const action = actions.uploadMediaFail(name, error)

    it('sets isUploading and error', () => {
      let state = uploadsView(undefined, action)

      expect(state[name].isUploading).toEqual(false)
      expect(state[name].error).toEqual(error)
    })
  })
})
