import "./common/App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

import LoginModal from "./unauthenticated/LoginModal";
import SignupModal from "./unauthenticated/SignupModal";
import TeacherDashboard from "./teacher_view/Dashboard";
import StudentDashboard from "./student_view/Dashboard";
import MeetingPlanDashboard from "./common/view/MeetingPlanDashboard";

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

    const MeetingPlanNav = () => {
        const { planId } = useParams();
        return <Navigate to={`/dashboard/meeting-plans/${planId}/details`} replace />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route
                    path="/login"
                    element={userRole ? <Navigate to="/dashboard" replace /> : <LoginModal roleSetter={setUserRole} />}
                />
                <Route path="/signup" element={<SignupModal />} />
                <Route path="/logout" element={<Logout />} />
                <Route
                    path="/dashboard"
                    element={
                        userRole ? <Navigate to="/dashboard/meeting-plans" replace /> : <Navigate to="/login" replace />
                    }
                />
                <Route path="/dashboard/meeting-plans" element={<DashboardRoute componentToShow="meeting-plans" />} />
                <Route
                    path="/dashboard/meeting-plans/:planId/"
                    element={
                        <MeetingPlanNav/>
                    }
                />
                <Route
                    path="/dashboard/meeting-plans/:planId/details"
                    element={
                        <ProtectedRoute>
                            <MeetingPlanDashboard componentToShow="meeting-plan-details"/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/meeting-plans/:planId/student-groups"
                    element={
                        <ProtectedRoute>
                            <MeetingPlanDashboard componentToShow="meeting-plan-student-groups"/>
                        </ProtectedRoute>
                    }
                />
                <Route path="/dashboard/events" element={<DashboardRoute componentToShow="scheduled-event" />} />
                <Route
                    path="/dashboard/students"
                    element={
                        <ProtectedRoute>
                            <TeacherDashboard componentToShow="students" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/groups"
                    element={
                        <DashboardRoute componentToShow="groups"/>
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
