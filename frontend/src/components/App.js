import './common/App.css'
import React from 'react';
import  { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginModal from './unauthenticated/LoginModal';
import SignupModal from './unauthenticated/SignupModal';
import TeacherDashboard from './teacher_view/Dashboard';
import StudentDashboard from './student_view/Dashboard';


function App() {
    const userRole = localStorage.getItem("userRole")

    const ProtectedRoute = ({ children }) => {
      return localStorage.getItem("userRole") ? children : <Navigate to="/login" />;
    };

    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            userRole ? <Navigate to="/dashboard" /> : <LoginModal />
          } />
          <Route path="/signup" element={<SignupModal />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/meeting-plans" />} />
          <Route path="/dashboard/meeting-plans" element={
            <ProtectedRoute>
              {userRole === "TEACHER" ? <TeacherDashboard componentToShow="meeting-plans"/> : <StudentDashboard componentToShow="meeting-plans"/>}
            </ProtectedRoute>
          } />
          <Route path="/dashboard/events" element={
            <ProtectedRoute>
              {userRole === "TEACHER" ? <TeacherDashboard componentToShow="scheduled-event"/> : <StudentDashboard componentToShow="scheduled-event"/>}
            </ProtectedRoute>
          } />
          <Route path="/dashboard/students" element={<TeacherDashboard componentToShow="students" />} />
          <Route path="/dashboard/notifications" element={<TeacherDashboard componentToShow="notifications" />} />
        </Routes>
      </Router>
    );
  }


export default App;
