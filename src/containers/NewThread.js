import { connect } from 'react-redux'
import randomString from 'crypto-random-string'
import { actions } from '../models/threads'

import NewThread from '../components/NewThread'

const mapDispatchToProps = (dispatch) => ({
  createThread: (values) => {
    let name = randomString(10)
    dispatch(actions.createThread(name, values))
  }
})

export default connect(null, mapDispatchToProps)(NewThread)
