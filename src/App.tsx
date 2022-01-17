import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import Dashboard from './Components/Dashboard';
import WelcomePage from './Components/WelcomePage';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider>
          <div className="App">
            <Routes>
              <Route path="/favourites" element={<Dashboard />} />
              <Route path="/" element={<WelcomePage />} />
            </Routes>
          </div>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
