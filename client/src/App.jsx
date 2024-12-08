import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import OrderManagement from './pages/OrderManagement';
import NotificationManagement from './pages/NotificationManagement';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Toaster position="top-right" />
      {isAuthenticated ? (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
            <main className="p-6 mt-16">
              <Routes>
                <Route path="/" element={<Navigate to="/admin/users" replace />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/notifications" element={<NotificationManagement />} />
                <Route path="*" element={<Navigate to="/admin/users" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;