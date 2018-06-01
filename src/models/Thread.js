import { createTypes, actionCreator } from 'redux-action-creator'

const types = createTypes([
  'NEW_POST',
  'THREAD_UPDATED',
  'POST'
])

const creators = {
  post: actionCreator(types.POST, 'post'),
  newPost: actionCreator(types.NEW_POST, 'post'),
  threadUpdated: actionCreator(types.THREAD_UPDATED)
}

export const actions = {
  types,
  creators
}

const accessPolicy = {
  write: ['*']
}

export default class Thread {
  constructor(store, orbit) {
    this.store = store
    this.orbit = orbit
  }

  async init(address) {
    this.db = await this.orbit.feed(address, accessPolicy)
    await this.db.load()
    this.db.events.on('replicated', this.replicated)
  }

  async post(payload) {
    await this.db.add(payload)
    this.store.dispatch(creators.newPost(payload))
  }

  replicated(address) {
    this.store.dispatch(creators.threadUpdated())
  }
}
