
import IPFS from 'ipfs'
import { expectSaga } from 'redux-saga-test-plan'

import { upload, uploads, actions } from '../..'

jest.mock('ipfs')
let ipfs = new IPFS()

describe("media#upload", () => {
  const name = "some_name"
  const hash = "some_hash"
  let ipfs = new IPFS()
  const action = actions.uploadMedia(name, {})

  beforeAll(() => {
    jest.clearAllMocks()
    ipfs.files = {
      add: jest.fn().mockImplementation((buffer, cb) => {
        cb(null, [{ hash }])
      })
    }
  })

  it("uploads media with IPFS", () => {
    return expectSaga(upload, ipfs, action)
      .hasFinalState({
        [name]: hash
      })
      .withReducer(uploads)
      .run()
  })

  describe("when error occurs", () => {
    const error = new Error("WTF")

    beforeAll(() => {
      ipfs.files.add = jest.fn().mockImplementation((buffer, cb) => {
        cb(error)
      })
    })

    it("dispatches UPLOAD_MEDIA_FAIL", () => {
      return expectSaga(upload, ipfs, action)
        .put(actions.uploadMediaFail(name, error))
        .run()
    })
  })
})
