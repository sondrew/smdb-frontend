import React from 'react';

import { RecoilRoot } from 'recoil';
import { ChakraProvider, Heading } from '@chakra-ui/react';

import Dashboard from './Components/Dashboard';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <div className="App">
          <Heading as="h1" textAlign="center" size="lg" pt={3}>
            Sondre's Movie Database
          </Heading>
          <Dashboard />
        </div>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
