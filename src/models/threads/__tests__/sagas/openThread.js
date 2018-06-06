import { apply, put, call } from 'redux-saga/effects'
import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'
import { expectSaga } from 'redux-saga-test-plan'

import {
  openThread,
  loadThread,
  updateThread,
  serveThread,
  actions,
  threads,
} from '../../'

jest.mock('orbit-db')
jest.mock('orbit-db-feedstore')

let orbitdb = new OrbitDB()
let address = "/orbitdb/QmfY3udPcWUD5NREjrUV351Cia7q4DXNcfyRLJzUPL3wPD/hello"
let action = actions.openThread(address)
let thread

describe('threads#openThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread = new FeedStore()
    thread.events = {
      on: jest.fn(),
    }
    thread.address = address
    orbitdb.open.mockReturnValue(Promise.resolve(thread))
  });

  it('opens thread from adderss', () => {
    return expectSaga(openThread, orbitdb, action)
      .withReducer(threads)
      .hasFinalState({
        [address]: {
          isLoading: false,
          posts: [],
          closed: false,
          address
        }
      })
      .put(actions.openThreadSuccess(address))
      .silentRun()
      .then(() => {
        expect(orbitdb.open).toBeCalledWith(address, { sync: true })
      })
  })

  it('loads a thread', () => {
    return expectSaga(openThread, orbitdb, action)
      .call(loadThread, thread)
      .silentRun()
  })

  it('allows to close thread', () => {
    return expectSaga(openThread, orbitdb, action)
      .withReducer(threads)
      .hasFinalState({
        [address]: {
          isLoading: false,
          posts: [],
          closed: true,
          address
        }
      })
      .put(actions.closeThreadSuccess(address))
      .apply(thread, thread.close)
      .dispatch(actions.closeThread(address))
      .run()
  })

  it('starts seving thread', () => {
    return expectSaga(openThread, orbitdb, action)
      .fork(serveThread, thread)
      .silentRun()
  })

  describe('when opening fails', () => {
    let error = new Error("WTF")

    beforeEach(() => {
      orbitdb.open.mockImplementation(() => { throw error })
    });

    it("doesn't crash", async () => {
      const { storeState } = await expectSaga(openThread, orbitdb, action)
        .withReducer(threads)
        .put({
          type: 'OPEN_THREAD_FAIL',
          payload: {
            address,
            error
          }
        })
        .run()

      expect(storeState[address].error).toEqual(error)
    })
  })
})