import React from 'react';
import { RecoilRoot } from 'recoil';

import Dashboard from './Components/Dashboard';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <header>Sondre's Movie Database</header>
        <Dashboard />
      </div>
    </RecoilRoot>
  );
}

export default App;
