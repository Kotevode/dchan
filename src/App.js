import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Loader from './containers/Loader'
import Navbar from './components/Navbar'
import NewThread from './containers/NewThread'
import Home from './components/Home'

export default ({ children }) => (
  <div className="App">
    <Loader>
      <Navbar/>
      <Switch>
        <Route path="/threads/new" component={NewThread} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Loader>
  </div>
)
