import { connect } from 'react-redux'

import Thread from '../components/Thread'
import actions from '../actions'
import { actions as threadActions } from '../models/Thread'

const mapStateToProps = (state) => {}

const mapDispatchToProps = (dispatch) => ({
  openThread: (name) => dispatch(actions.openThread(name)),
  createThread: (name) => dispatch(actions.createThread(name)),
  send: (values) => dispatch(threadActions.creators.post(values))
})

export default connect(
  null,
  mapDispatchToProps
)(Thread)
