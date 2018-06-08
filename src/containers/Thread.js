import { connect } from 'react-redux'

import Thread from '../components/Thread'
import { actions } from '../models/threads'

const selectedThread = (state) => state.views.threads.selectedThread
const posts = (state, address) => {
  if (state.entities.threads[address]) {
    return state.entities.threads[address].posts
  } else {
    return []
  }
}

const mapStateToProps = (state) => ({
  address: selectedThread(state),
  posts: posts(state, selectedThread(state))
})

const mergeProps = (state, { dispatch }) => {
  let { address } = state
  return {
    ...state,
    openThread: ({ address }) => dispatch(actions.openThread(address)),
    createThread: (name) => dispatch(actions.createThread(name)),
    send: (values) => dispatch(actions.addPost(address, values))
  }
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(Thread)
