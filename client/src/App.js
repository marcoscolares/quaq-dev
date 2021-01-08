import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';

import Hooks from './hooks';

import Routes from './routes';

function App() {
  return (
    <Router>
      <Hooks>
        <GlobalStyle />
        <Routes />
      </Hooks>
    </Router>
  );
}
export default App;
