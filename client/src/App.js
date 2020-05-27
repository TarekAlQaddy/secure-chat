import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import CreateRoom from './components/CreateRoom/CreateRoom'
import Room from './components/Room/Room'
import './App.scss';

function App() {
  return (
    <main className="app">
      <div className="app-card">
        <Router>
          <Switch>
            <Route path="/rooms/:roomName">
              <Room />
            </Route>
            <Route path="/">
              <CreateRoom />
            </Route>
            <Route path="*">
              404
            </Route>
          </Switch>
        </Router>
      </div>
    </main>
  );
}

export default App;
