import { threadsView, actions } from '../..'

let address = 'some_address'
let state

describe('threadsView', () => {
  describe('when OPEN_THERAD_SUCCESS is dispatched', () => {
    beforeEach(() => {
      state = threadsView(undefined, actions.openThreadSuccess(address))
    });

    it("sets selectedThread", () => {
      expect(state.selectedThread).toEqual(address)
    })

    it("sets loading to false", () => {
      expect(state[address].isLoading).toEqual(false)
    })

    it("sets isClosed to false", () => {
      expect(state[address].isClosed).toEqual(false)
    })
  })

  describe('when OPEN_THREAD is dispatched', () => {
    beforeEach(() => {
      state = threadsView(undefined, actions.openThread(address))
    })

    it('sets loading to true', () => {
      expect(state[address].isLoading).toEqual(true)
    })
  })

  describe('when CREATE_THREAD_SUCCESS is dispatched', () => {
    beforeEach(() => {
      state =  threadsView(
        undefined,
        actions.createThreadSuccess('some_name', address)
      )
    })

    it('sets selectedThread', ()  => {
      expect(state.selectedThread).toEqual(address)
    })

    it('sets loading to false', () => {
      expect(state[address].isLoading).toEqual(false)
    })
  })

  describe('when CLOSE_THREAD_SUCCESS is dispatch', () => {
    beforeEach(() => {
      state = threadsView(undefined, actions.closeThreadSuccess(address))
    });

    it('sets isClosed to true', () => {
      expect(state[address].isClosed).toEqual(true)
    })
  })
})
