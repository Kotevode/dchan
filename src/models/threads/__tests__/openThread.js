import { apply, put, call } from 'redux-saga/effects'
import OrbitDB from 'orbit-db'

import { openThread, loadThread, updateThread, serveThread, actions } from '../'

jest.mock('orbit-db')

let orbitdb = new OrbitDB()
let address = "/orbitdb/QmfY3udPcWUD5NREjrUV351Cia7q4DXNcfyRLJzUPL3wPD/hello"
let saga
let thread = {
  load: jest.fn(),
  events: {
    on: jest.fn()
  }
}

describe('threads#openThread', () => {
  beforeAll(() => {
    saga = openThread(orbitdb, actions.openThread(address))
  });

  it('opens a feed from address', () => {
    expect(saga.next().value)
      .toEqual(apply(orbitdb, orbitdb.open, [
        address,
        {
          sync: true
        }
      ]))
  })

  it('loads a thread', () => {
    expect(saga.next(thread).value)
      .toEqual(call(loadThread, thread))
  })

  it('dispatches an action that thread is opened', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: 'OPEN_THREAD_SUCCESS',
        payload: {
          address
        }
      }))
  })

  it('stars serving actions', () => {
    expect(saga.next().value)
      .toEqual(call(serveThread, thread))
  })
})
