import { expectSaga } from 'redux-saga-test-plan'
import EventEmitter from 'events'
import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'

import { openThread, updateThread, actions, threads } from '../..'

jest.mock('orbit-db')
jest.mock('orbit-db-feedstore')

let orbitdb = new OrbitDB()
let thread = new FeedStore()
thread.events = new EventEmitter()
let address = 'some_address'

describe('threads#eventHandling', () => {
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
      thread.iterator.mockReturnValue({
        collect: jest.fn()
          .mockReturnValue([])
          .mockReturnValue([ post ])
          .mockReturnValue([ post, receivedPost ])
      })
      thread.load.mockImplementation(() => {
        thread.events.emit('ready')
      })
      thread.add.mockImplementation(() => {
        thread.events.emit('write')
      })
      setTimeout(() => {
        thread.events.emit('replicated')
      }, 250)
    });

    it('collects posts from db', () => {
      return expectSaga(openThread, orbitdb, action)
      .hasFinalState({
          ['some_address']: {
            isLoading: false,
            closed: false,
            posts: [ post, receivedPost ],
            address: 'some_address'
          },
          byName: {}
        })
        .withReducer(threads)
        .dispatch(actions.addPost(address, post))
        .silentRun()
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
            isLoading: false,
            closed: false,
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
