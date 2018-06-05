const mock = jest.fn().mockImplementation(() => ({
  open: jest.fn(),
  feed: jest.fn().mockImplementation(() => Promise.resolve({
    load: jest.fn(),
    add: jest.fn(),
    events: {
      on: jest.fn()
    }
  }))
}))

export default mock
