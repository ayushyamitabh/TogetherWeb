import React, { Component } from 'react';
import {AppBar, Toolbar, Typography} from 'material-ui';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <AppBar className="navigation">
          <Toolbar>
            <Typography type="title" color="inherit">
              MUSICROOM
            </Typography>
          </Toolbar>
        </AppBar>

      </div>
    );
  }
}

export default App;
