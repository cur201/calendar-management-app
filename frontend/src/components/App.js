import './common/App.css'
import React from 'react';
import  { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginModal from './unauthenticated/LoginModal';
import SignupModal from './unauthenticated/SignupModal';
import TeacherDashboard from './teacher_view/Dashboard';


function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/signup" element={<SignupModal />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/meeting-plans" />} />
          <Route path="/dashboard/meeting-plans" element={<TeacherDashboard />} />
          <Route path="/dashboard/events" element={""} />
          <Route path="/dashboard/students" element={""} />
          <Route path="/dashboard/notifications" element={""} />
        </Routes>
      </Router>
    );
  }


export default App;
