import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Loader from './containers/Loader'
import Navbar from './components/Navbar'
import Thread from './containers/Thread'
import NewThread from './containers/NewThread'
import Home from './components/Home'

export default ({ children }) => (
  <div className="App">
    <Loader>
      <Navbar/>
      <main>
        <Switch>
          <Route path="/threads/new" component={NewThread} />
          <Route path="/threads/:manifest/:name" component={Thread} />
          <Route exact path="/" component={Home} />
        </Switch>
      </main>
    </Loader>
  </div>
)
