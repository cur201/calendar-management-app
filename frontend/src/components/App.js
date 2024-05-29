import "./common/App.css";

import React, { useState, useEffect } from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import LoginModal from "./unauthenticated/LoginModal";

import SignupModal from "./unauthenticated/SignupModal";

import TeacherDashboard from "./teacher_view/Dashboard";

import StudentDashboard from "./student_view/Dashboard";

function App() {
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

    const handleStorageChange = () => {
        setUserRole(localStorage.getItem("userRole"));
    };

    useEffect(() => {
        setUserRole(localStorage.getItem("userRole"));
        const handleStorageChange = () => {
            setUserRole(localStorage.getItem("userRole"));
        };
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const ProtectedRoute = ({ children }) => {
        return userRole ? children : <Navigate to="/login" replace />;
    };

    const Logout = () => {
        useEffect(() => {
            localStorage.clear();

            setUserRole(null);
        }, []);

        return <Navigate to="/login" replace />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route
                    path="/login"
                    element={
                        userRole ? (
                            <Navigate to="/dashboard/meeting-plans" replace />
                        ) : (
                            <LoginModal />
                        )
                    }
                />

                <Route
                    path="/dashboard/meeting-plans"
                    element={
                        <ProtectedRoute>
                            {userRole === "TEACHER" ? (
                                <TeacherDashboard componentToShow="meeting-plans" />
                            ) : (
                                <StudentDashboard componentToShow="meeting-plans" />
                            )}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/events"
                    element={
                        <ProtectedRoute>
                            {userRole === "TEACHER" ? (
                                <TeacherDashboard componentToShow="scheduled-event" />
                            ) : (
                                <StudentDashboard componentToShow="scheduled-event" />
                            )}
                        </ProtectedRoute>
                    }
                />
                {/* <Route
          path="/dashboard/students"
          element={<TeacherDashboard componentToShow="students" />}
        /> */}
                <Route
                    path="/dashboard/students"
                    element={
                        <ProtectedRoute>
                            <TeacherDashboard componentToShow="students" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/notifications"
                    element={
                        <ProtectedRoute>
                            <TeacherDashboard componentToShow="notifications" />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
