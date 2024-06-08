import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';
import Friends from './components/Friends';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/Friends" element={<Friends />} />
          <Route
            path="/"
            element={<Navigate to="/Login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;