import { expectSaga } from 'redux-saga-test-plan'
import EventEmitter from 'events'
import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'

import { openThread, updateThread, actions, threads, dbEvents } from '../..'

jest.mock('orbit-db')
jest.mock('orbit-db-feedstore')

let orbitdb = new OrbitDB()
let thread = new FeedStore()
let address = 'some_address'

describe('threads#serveThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread.address = {
      toString: jest.fn().mockReturnValue(address)
    }
    orbitdb.open.mockReturnValue(thread)
  })

  describe('when thread emits an event', () => {
    const post = { text: 'Foo' }
    const receivedPost = { text: 'Bar' }
    const action = actions.openThread(address)

    beforeEach(() => {
      thread.events = new EventEmitter()
      thread.load.mockImplementation(() => {
        thread.events.emit('ready')
      })
      thread.add.mockImplementation(() => {
        thread.events.emit('write')
      })
      setTimeout(() => {
        thread.events.emit('replicated')
      }, 250)
      thread.iterator.mockReturnValue({
        collect: jest.fn()
          .mockReturnValue([])
          .mockReturnValue([ post ])
          .mockReturnValue([ post, receivedPost ])
      })
    });

    it('collects posts from db', () => {
      return expectSaga(openThread, orbitdb, action)
        .dispatch(actions.addPost(address, post))
        .run(1000)
        .then(() => {
          expect(thread.iterator.mock.calls.length).toEqual(3)
          expect(thread.iterator).toBeCalledWith({ limit: -1 })
          expect(thread.iterator().collect.mock.calls.length).toEqual(3)
        })
    })

    it('adds posts to store', () => {
      return expectSaga(openThread, orbitdb, action)
        .hasFinalState({
          ['some_address']: {
            posts: [ post, receivedPost ],
            address: 'some_address'
          },
          byName: {}
        })
        .withReducer(threads)
        .dispatch(actions.addPost(address, post))
        .silentRun()
    })
  })
})
