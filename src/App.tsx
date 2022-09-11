import { Routes, Route } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import Dashboard from './Components/Dashboard';
import WelcomePage from './Components/WelcomePage';
import './App.css';
import customTheme from './customTheme';
import RecommendationEditor from './Components/Editor/RecommendationEditor';
import ViewRecommendationList from './Components/Viewer/ViewRecommendationList';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={customTheme}>
          <div className="App">
            <Routes>
              <Route path="/favourites" element={<Dashboard />} />
              <Route path="/" element={<WelcomePage />} />
              <Route path="/edit" element={<RecommendationEditor />} />
              <Route path="/l/*" element={<ViewRecommendationList />} />
            </Routes>
          </div>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
