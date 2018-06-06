import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'
import { expectSaga } from 'redux-saga-test-plan'

import { actions, types, openThread } from '../../'

jest.mock('orbit-db-feedstore')

const hash = "some_hash"
const address = "some_address"
const action = actions.addPost({
  text: "FooBar"
})

let thread = new FeedStore()
let orbitdb = new OrbitDB()

describe("threads#addPost", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread.address = {
      toString: jest.fn().mockReturnValue(address),
    }
    thread.events = {
      on: jest.fn()
    }
    orbitdb.open.mockReturnValue(Promise.resolve(thread))
  });

  describe("when post success", () => {
    beforeAll(() => {
      thread.add.mockReturnValue(Promise.resolve(hash))
    });

    it("dispatches success", () => {
      return expectSaga(openThread, orbitdb, actions.openThread(address))
        .put({
          type: 'ADD_POST_SUCCESS',
          payload: {
            hash,
            address,
          }
        })
        .dispatch(action)
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
      return expectSaga(openThread, orbitdb, actions.openThread(address))
        .put({
          type: 'ADD_POST_FAIL',
          payload: {
            error
          }
        })
        .dispatch(action)
        .run()
    })
  })
})