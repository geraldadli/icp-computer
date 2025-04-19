import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import InfoScreen from './components/InfoScreen';
import RoleSelection from './components/RoleSelection';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/info" element={<InfoScreen />} />
        <Route path="/roles" element={<RoleSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
