import { connect } from 'react-redux'

import Thread from '../components/Thread'
import { actions } from '../models/threads'

const mapStateToProps = (state) => ({
  address: state.views.threads.selectedThread
})

const mergeProps = (state, { dispatch }) => {
  let { address } = state
  return {
    address,
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
