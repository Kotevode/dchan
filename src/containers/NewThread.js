import { connect } from 'react-redux'

import NewThread from '../components/NewThread'

const mapDispatchToProps = (dispatch) => {
  createThread: (values) => {
    console.log(values)
  }
}

export default connect(null, mapDispatchToProps)(NewThread)
