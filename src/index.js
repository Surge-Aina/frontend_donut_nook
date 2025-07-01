// Entry point: bootstraps React into #root
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';        // Global styles (or Tailwind import)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// DO NOT modify the above bootstrap logic
// This is the entry point for the React app, which initializes the application
// and renders the main App component into the root element.