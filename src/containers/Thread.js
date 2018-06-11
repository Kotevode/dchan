import { connect } from 'react-redux'

import Thread from '../components/Thread'
import { actions } from '../models/threads'

const getThread = (state, address) => state.entities.threads[address]

const mapStateToProps = (state, props) => {
  let { manifest, name } = props.match.params
  let address = `/orbitdb/${manifest}/${name}`
  let thread = getThread(state, address) || {
    address,
    isLoading: true,
    closed: true
  }
  console.log(thread)
  let posts = thread.posts || []
  return {
    thread,
    posts
  }
}

const mergeProps = (state, { dispatch }) => {
  let { address } = state.thread
  return {
    ...state,
    openThread: (address) => dispatch(actions.openThread(address)),
    closeThread: (address) => dispatch(actions.closeThread(address)),
    send: (values) => dispatch(actions.addPost(address, values))
  }
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(Thread)
