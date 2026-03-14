import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardLayout from "./components/DashboardLayout"; 
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/landing/LandingPage";
import Workouts from "./pages/workout/Workouts";
import CreateWorkout from "./pages/workout/CreateWorkout";
import EditWorkout from "./pages/workout/EditWorkout";
import WorkoutDetail from "./pages/workout/WorkoutDetail";

import Nutritions from "./pages/nutrition/Nutritions";
import CreateNutrition from "./pages/nutrition/CreateNutrition";
import EditNutrition from "./pages/nutrition/EditNutrition";
import NutritionDetail from "./pages/nutrition/NutritionDetail";

import Progress from "./pages/progress/Progress";
import CreateProgress from "./pages/progress/CreateProgress";
import EditProgress from "./pages/progress/EditProgress";
import ProgressDetail from "./pages/progress/ProgressDetail";

import Achievements from './pages/achievements/Achievements';
import AchievementWorkoutDetail from './pages/achievements/WorkoutDetail';
import AchievementNutritionDetail from './pages/achievements/NutritionDetail';

import Explore from "./pages/Explore";
import Creator from "./pages/Creator";
import Support from "./pages/Support";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTickets from "./pages/admin/AdminTickets";
import NotificationPanel from "./components/NotificationPanel";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgba(20, 20, 30, 0.9)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "16px 20px",
              },
              success: {
                icon: "✅",
                style: {
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                },
              },
              error: {
                icon: "❌",
                style: {
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                },
              },
            }}
          />

          <Routes>
            {/* Landing Page - accessible without login */}
            <Route
              path="/landing"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />

            {/* Public Routes - accessible only when NOT logged in */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOTP />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            {/* Landing Page - accessible without login (default for public users) */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Dashboard for logged in users */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardWrapper page="dashboard" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Explore />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardWrapper page="profile" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/:userId"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardWrapper page="settings" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Workout Routes */}
            <Route
              path="/workout"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Workouts />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/create"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateWorkout />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/edit/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EditWorkout />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <WorkoutDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Nutrition Routes */}
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Nutritions />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition/create"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateNutrition />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition/edit/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EditNutrition />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NutritionDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Progress Routes */}

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Progress />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress/create"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateProgress />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress/edit/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EditProgress />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProgressDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />


              {/* Achivements Routes */}
            <Route
              path="/achivements"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Achievements />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements/workout/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AchievementWorkoutDetail  />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements/nutrition/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AchievementNutritionDetail  />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            


            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NotificationPanel isFullPage={true} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/creator"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Creator />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Support />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardLayout isAdmin={true} />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/tickets" replace />} />
              <Route path="tickets" element={<AdminTickets />} />
            </Route>

            {/* Catch all - redirect to dashboard if authenticated, else login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Dashboard wrapper to handle navigation (simplified)
const DashboardWrapper = ({ page }) => {
  const [currentPage, setCurrentPage] = useState(page || "dashboard");

  // Update currentPage when page prop changes
  useEffect(() => {
    setCurrentPage(page || "dashboard");
  }, [page]);

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <Profile onNavigate={setCurrentPage} />;
      case "settings":
        return <Settings onNavigate={setCurrentPage} />;
      default:
        return (
          <Dashboard currentPage={currentPage} onNavigate={setCurrentPage} />
        );
    }
  };

  return renderPage();
};

export default App;
