import { expectSaga } from 'redux-saga-test-plan'
import EventEmitter from 'events'
import FeedStore from 'orbit-db-feedstore'

import { serveThread, updateThread, actions } from '../..'

jest.mock('orbit-db-feedstore')
let thread = new FeedStore()

describe('threads#updateThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread.address = {
      toString: jest.fn().mockReturnValue('some_address')
    }
  });

  describe('when thread emits an event', () => {
    beforeEach(() => {
      thread.events = new EventEmitter()
      thread.add.mockImplementation(() => {
        thread.events.emit('write', 'some_name', 'some_hash', 'some_entry')
      })
      thread.iterator.mockReturnValue({
        collect: jest.fn().mockReturnValue([])
      })
    });

    it('collects posts from db', () => {
      return expectSaga(serveThread, thread)
        .dispatch(actions.addPost({
          text: 'FooBar'
        }))
        .silentRun()
        .then(() => {
          expect(thread.iterator).toBeCalledWith({ limit: -1 })
          expect(thread.iterator().collect).toBeCalled()
        })
    })
  })
})
