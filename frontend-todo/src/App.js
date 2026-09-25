import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodosPage from './pages/TodosPage';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected todos dashboard */}
            <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <TodosPage />
                </ProtectedRoute>
              }
            />

            {/* Default root redirects to /todos */}
            <Route path="/" element={<Navigate to="/todos" replace />} />

            {/* Catch-all undefined routes */}
            <Route path="*" element={<Navigate to="/todos" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
