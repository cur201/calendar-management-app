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

const App = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

    useEffect(() => {
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

    const DashboardRoute = ({ componentToShow }) => (
        <ProtectedRoute>
            {userRole === "TEACHER" ? (
                <TeacherDashboard componentToShow={componentToShow} />
            ) : (
                <StudentDashboard componentToShow={componentToShow} />
            )}
        </ProtectedRoute>
    );

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route
                    path="/login"
                    element={
                        userRole ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LoginModal />
                        )
                    }
                />
                <Route path="/signup" element={<SignupModal />} />
                <Route path="/logout" element={<Logout />} />
                <Route
                    path="/dashboard"
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
                    element={<DashboardRoute componentToShow="meeting-plans" />}
                />
                <Route
                    path="/dashboard/events"
                    element={
                        <DashboardRoute componentToShow="scheduled-event" />
                    }
                />
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
};

export default App;
