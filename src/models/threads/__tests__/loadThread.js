import { apply } from 'redux-saga/effects'

import { loadThread } from '../'

let thread = {
  load: jest.fn(),
  events: {
    on: jest.fn()
  }
}
let saga

describe('threads#load', () => {
  beforeAll(() => {
    saga = loadThread(thread)
  });

  it('loads thread', () => {
    expect(saga.next(thread).value)
      .toEqual(apply(thread, thread.load))
  })

  it('binds an events', () => {
    expect(thread.events.on.mock.calls.map(c => c[0]))
      .toEqual([ 'ready', 'write', 'replicated' ])
  })
})
