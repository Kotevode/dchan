import React from 'react'

export default ({ isLoading, children }) => (
  <div className="loader">
    { isLoading ? "Loading" : children }
  </div>
)
