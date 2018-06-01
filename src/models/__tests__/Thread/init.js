import configureStore from 'redux-mock-store'
import OrbitDB from 'orbit-db'
import Thread from '../../Thread'

jest.mock('orbit-db')

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

  describe('#init', async () => {
    let name = 'Name'
    let access = {
      write: ['*']
    }

    beforeEach(async () => {
      await thread.init(name)
    });

    it('creates a new thread or connects to existing', async () => {
      expect(orbitdb.feed).toBeCalledWith(name, access)
    })

    it('loads thread', async () => {
      expect(thread.db.load).toBeCalled()
    })

    it('provides event handler to db', async () => {
      expect(thread.db.events.on).toBeCalledWith(
        'replicated',
        thread.replicated
      )
    })
  })
})
