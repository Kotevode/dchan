import { threadsView, actions } from '../..'

let address = 'some_address'

describe('threadsView', () => {
  describe('when OPEN_THERAD_SUCCESS is dispatched', () => {
    it("sets selectedThread", () => {
      let state = threadsView(undefined, actions.openThreadSuccess(address))

      expect(state.selectedThread).toEqual(address)
    })
  })

  describe('when CREATE_THREAD_SUCCESS is dispatched', () => {
    it('sets selectedThread', ()  => {
      let state = threadsView(
        undefined,
        actions.createThreadSuccess('some_name', address)
      )

      expect(state.selectedThread).toEqual(address)
    })
  })
})
