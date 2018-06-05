import { apply, put, call } from 'redux-saga/effects'
import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'
import { expectSaga } from 'redux-saga-test-plan'

import { openThread, loadThread, updateThread, serveThread, actions } from '../'

jest.mock('orbit-db')
jest.mock('orbit-db-feedstore')

let orbitdb = new OrbitDB()
let address = "/orbitdb/QmfY3udPcWUD5NREjrUV351Cia7q4DXNcfyRLJzUPL3wPD/hello"
let action = actions.openThread(address)

describe('threads#openThread', () => {
  it('opens feed from adderss', () => {
    let thread = new FeedStore()
    thread.events = {
      on: jest.fn()
    }

    return expectSaga(openThread, orbitdb, action)
      .put({
        type: 'CLOSE_THREAD_SUCCESS',
        payload: {}
      })
      .apply(thread, thread.close)
      .dispatch(actions.closeThread())
      .fork(serveThread, thread)
      .put({
        type: 'OPEN_THREAD_SUCCESS',
        payload: {
          address
        }
      })
      .call(loadThread, thread)
      .provide([
        [apply(orbitdb, orbitdb.open, [
          address, { sync: true }
        ]), thread]
      ])
      .run()
  })
})
