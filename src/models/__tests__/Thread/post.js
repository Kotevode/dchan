import configureStore from 'redux-mock-store'
import chai from 'chai'
import OrbitDB from 'orbit-db'
import Thread, { actions } from '../../Thread'

jest.mock('orbit-db')

var assert = chai.assert
const mockStore = configureStore()

let thread
let store
let orbitdb

describe('Thread', async () => {
  beforeEach(() => {
    OrbitDB.mockClear()
    orbitdb = new OrbitDB()
    store = mockStore()
    thread = new Thread(store, orbitdb)
  });

  describe('#post', async () => {
    const post = { text: "FooBar" }

    beforeEach(async () => {
      await thread.init("Some thread")
      await thread.post(post)
    });

    it('dispatches action to store', async () => {
      assert.deepEqual(
        store.getActions(),
        [ actions.creators.newPost(post) ]
      )
    })

    it('calls add method on db instance', async () => {
      expect(thread.db.add).toBeCalledWith(post)
    })
  })
})
