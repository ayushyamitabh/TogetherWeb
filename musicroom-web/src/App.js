import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './Home.js';
import Room from './Room.js'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/room/:name" component={Room}/>
      </div>
    );
  }
}

export default App;
