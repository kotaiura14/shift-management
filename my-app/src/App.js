import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShiftManager from './components/ShiftManager';
import LaborManager from './components/LaborManager.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/shift" element={<ShiftManager />} />
          <Route path="/labor" element={<LaborManager />} />
          <Route path="/" element={<ShiftManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
