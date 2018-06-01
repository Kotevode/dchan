import configureStore from 'redux-mock-store'
import chai from 'chai'
import OrbitDB from 'orbit-db'
import Thread, { actions } from '../../Thread'

var assert = chai.assert
const mockStore = configureStore()

let thread
let store
let orbitdb

describe('Thread', async () => {
  beforeAll(async () => {
    OrbitDB.mockClear()
    orbitdb = new OrbitDB()
    store = mockStore()
    thread = new Thread(store, orbitdb)
    await thread.init("foobar")
  });

  describe('#replicated', async () => {
    beforeAll(async () => {
      thread.replicated()
    });

    it('dispatches thread updated action', async () => {
      assert.deepEqual(
        store.getActions(),
        [ actions.creators.threadUpdated() ]
      )
    })
  })
})
