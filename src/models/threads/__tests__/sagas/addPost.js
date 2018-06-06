import FeedStore from 'orbit-db-feedstore'
import { expectSaga } from 'redux-saga-test-plan'

import { actions, types, addPost } from '../../'

jest.mock('orbit-db-feedstore')

const hash = "some_hash"
const address = "some_address"
const action = actions.addPost({
  text: "FooBar"
})

let thread = new FeedStore()

describe("threads#addPost", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread.address = {
      toString: jest.fn().mockReturnValue(address)
    }
  });

  describe("when post success", () => {
    beforeAll(() => {
      thread.add.mockReturnValue(
        Promise.resolve(hash)
      )
    });

    it("dispatches success", () => {
      return expectSaga(addPost, thread, action)
        .put({
          type: 'ADD_POST_SUCCESS',
          payload: {
            hash,
            address,
          }
        })
        .run()
    })
  })

  describe("when post fails", () => {
    const error = new Error("WTF")

    beforeAll(() => {
      thread.add.mockImplementation(() => {
        throw error
      })
    });

    it("dispatches error", () => {
      return expectSaga(addPost, thread, action)
        .put({
          type: 'ADD_POST_FAIL',
          payload: {
            error
          }
        })
        .run()
    })
  })
})
