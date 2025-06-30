import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<div style={{ padding: '2rem' }}><h1>🍩 Donut Nook - Home</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
