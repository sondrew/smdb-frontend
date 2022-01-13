import React from 'react';

import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';

import Dashboard from './Components/Dashboard';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <div className="App">
          <header>Sondre's Movie Database</header>
          <Dashboard />
        </div>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
