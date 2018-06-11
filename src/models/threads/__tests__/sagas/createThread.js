import FeedStore from 'orbit-db-feedstore'
import OrbitDB from 'orbit-db'
import { expectSaga } from 'redux-saga-test-plan'

import { actions, createThread, loadThread, serveThread, threads } from '../..'

jest.mock('orbit-db')
jest.mock('orbit-db-feedstore')

let orbitdb = new OrbitDB()
let name = "Some Name"
let nameUri = encodeURIComponent(name)
let address = `/orbitdb/some_hash/${nameUri}`
let thread

describe('threads#createThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    thread = new FeedStore()
    thread.address = {
      toString: jest.fn().mockReturnValue(address)
    }
    thread.events = {
      on: jest.fn(),
    }
    orbitdb.open.mockReturnValue(Promise.resolve(thread))
  });

  it('creates thread from a name', () => {
    return expectSaga(createThread, orbitdb, actions.createThread(name))
      .withReducer(threads)
      .hasFinalState({
        [address]: {
          posts: [],
          address
        },
        byName: {
          [nameUri]: address
        }
      })
      .put(actions.createThreadSuccess(nameUri, address))
      .silentRun()
      .then(() => {
        expect(orbitdb.open).toBeCalledWith(
          nameUri, {
            create: true,
            overwrite: true,
            localOnly: false,
            type: 'feed',
            write: [ '*' ]
          }
        )
      })
  })

  it('adds post if it exists in action payload', () => {
    let post = {
      title: name,
      text: 'Some text'
    }
    let action = actions.createThread(name, post)

    return expectSaga(createThread, orbitdb, action)
      .silentRun()
      .then(() => {
        expect(thread.add).toBeCalledWith(post)
      })
  })

  it('loads thread', () => {
    return expectSaga(createThread, orbitdb, actions.createThread(name))
      .apply(thread, thread.load)
      .silentRun()
  })

  it('starts serving', () => {
    return expectSaga(createThread, orbitdb, actions.createThread(name))
      .fork(serveThread, thread)
      .silentRun()
  })

  it('returns address', () => {
    return expectSaga(createThread, orbitdb, actions.createThread(name))
      .returns(address)
      .silentRun()
  })

  describe('when creation fails', () => {
    let error = new Error('WTF')

    beforeEach(() => {
      orbitdb.open.mockImplementation(() => { throw error })
    });

    it('dispatches createThreadFail', () => {
      return expectSaga(createThread, orbitdb, actions.createThread(name))
        .put({
          type: 'CREATE_THREAD_FAIL',
          payload: {
            name: nameUri,
            error
          }
        })
        .run()
    })
  })
})
