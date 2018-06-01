import React from 'react'

import Loader from './containers/Loader'
import Thread from './containers/Thread'

export default ({ children }) => (
  <div className="App">
    <Loader>
      <Thread/>
    </Loader>
  </div>
)
