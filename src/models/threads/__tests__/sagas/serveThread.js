import { expectSaga } from 'redux-saga-test-plan'
import EventEmitter from 'events'
import FeedStore from 'orbit-db-feedstore'

import { serveThread, updateThread, actions, threads } from '../..'

jest.mock('orbit-db-feedstore')
let thread = new FeedStore()
let initialState = threads(undefined, actions.openThreadSuccess('some_address'))

describe('threads#serveThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread.address = {
      toString: jest.fn().mockReturnValue('some_address')
    }
  });

  describe('when thread emits an event', () => {
    const post = { text: 'FooBar' }

    beforeEach(() => {
      thread.events = new EventEmitter()
      thread.add.mockImplementation(() => {
        thread.events.emit('ready')
        thread.events.emit('replicated')
        thread.events.emit('write')
      })
      thread.iterator.mockReturnValue({
        collect: jest.fn()
        .mockReturnValue([])
        .mockReturnValue([])
        .mockReturnValue([ post ])
      })
    });

    it('collects posts from db', () => {
      return expectSaga(serveThread, thread)
        .dispatch(actions.addPost(post))
        .silentRun()
        .then(() => {
          expect(thread.iterator.mock.calls.length).toEqual(3)
          expect(thread.iterator).toBeCalledWith({ limit: -1 })
          expect(thread.iterator().collect.mock.calls.length).toEqual(3)
        })
    })

    it('adds posts to store', () => {
      return expectSaga(serveThread, thread)
        .hasFinalState({
          ['some_address']: {
            isLoading: false,
            closed: false,
            posts: [ post ],
            address: 'some_address'
          },
          byName: {}
        })
        .withReducer(threads, initialState)
        .dispatch(actions.addPost(post))
        .silentRun()
    })
  })
})
