import React from 'react';

import Home from './pages/Home';
import Playlist from './pages/Playlists/Playlist';
import Results from './pages/Result/result'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <main>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/playlist" exact component={Playlist} />
            <Route path="/result" exact component={Results} />
          </Switch>
        </Router>
      </main>)
  }
}

export default App;

