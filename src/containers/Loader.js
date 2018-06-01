import { connect } from 'react-redux'

import Loader from '../components/Loader'

const mapStateToProps = (state) => ({
  isLoading: state.orbit.isLoading
})

export default connect(mapStateToProps)(Loader)
