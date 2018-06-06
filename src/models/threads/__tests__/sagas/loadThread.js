import { apply } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import FeedStore from 'orbit-db-feedstore'

import { loadThread } from '../../'

jest.mock('orbit-db-feedstore')

describe('threads#load', () => {
  it('loads thread and binds events', () => {
    let thread = new FeedStore()
    thread.events = {
      on: jest.fn()
    }

    return expectSaga(loadThread, thread)
      .apply(thread, thread.load)
      .run()
      .then(() => {
        // Checking binded events
        expect(thread.events.on.mock.calls.map(c => c[0]))
           .toEqual([ 'ready', 'write', 'replicated' ])
      })
  })
})
