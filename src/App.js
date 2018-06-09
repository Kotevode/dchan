import React from 'react'

import Loader from './containers/Loader'

export default ({ children }) => (
  <div className="App">
    <Loader>
      { children }
    </Loader>
  </div>
)
