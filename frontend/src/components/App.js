import './common/App.css'
import React from 'react';
import  { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginModal from './unauthenticated/LoginModal';
import SignupModal from './unauthenticated/SignupModal'


function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/signup" element={<SignupModal />} />
        </Routes>
      </Router>
    );
  }


export default App;
