import { actions, threads } from '../../'

describe("threads reducer", () => {
  describe("when OPEN_THREAD is dispatched", () => {
    it("it changes isLoading to true", () => {
      let address = "some_address"
      let state = threads(undefined, actions.openThread(address))

      expect(state[address].isLoading).toEqual(true)
    })
  })
})
