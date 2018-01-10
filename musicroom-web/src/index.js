import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'typeface-roboto';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
const theme = createMuiTheme({
  palette: createPalette({
    type: 'light',
  }),
});

ReactDOM.render((
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
