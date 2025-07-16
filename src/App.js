

// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public pages
import Home from './pages/public/Home';
import Menu from './pages/public/Menu';
import Specials from './pages/public/Specials';
import About from './pages/public/About';
import Store from './pages/public/Store';
import Customer from './pages/public/Customer';
import CustomerDashboard from './pages/public/CustomerDashboard';
import Contact from './pages/public/Contact';

// Manager/Admin shared
import ManagerMenu from './pages/manager/Menu';
import ManagerSpecials from './pages/manager/Specials';
import ManagerCustomers from './pages/manager/Customers';
import ManagerStore from './pages/manager/Store';
import ManagerDashboard from './pages/manager/Dashboard';

// Admin-only
import AdminDashboard from './pages/admin/Dashboard';
import AdminCustomers from './pages/admin/Customers';
import AdminManagers from './pages/admin/Managers';
import AdminStore from './pages/admin/Store';
import AdminAbout from './pages/admin/About';
import AdminSpecials from './pages/admin/Specials';

// Auth
import Auth from './pages/login/Auth';

// Protected route wrapper
import ProtectedRoute from './components/ProtectedRoute';
import Test from './pages/Test';

const App = () => {

  const location = useLocation();
  
  return (
    <AnimatePresence mode = "wait">
      <ToastContainer //toast added only to Auth.jsx failure notif for now
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" />} />

      {/* Public */}
      <Route path="/home" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/specials" element={<Specials />} />
      <Route path="/about" element={<About />} />
      <Route path="/store" element={<Store />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/contact" element={<Contact />} />

        {/* Login */}
        <Route path="/login" element={<Auth />} />

        {/* Manager & Admin Shared */}
        <Route
          path="/manager/menu"
          element={
            <ProtectedRoute requireRole="manager">
              <ManagerMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/specials"
          element={
            <ProtectedRoute requireRole={["manager", "admin"]}>
              <ManagerSpecials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/customers"
          element={
            <ProtectedRoute requireRole="manager">
              <ManagerCustomers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/store"
          element={
            <ProtectedRoute requireRole="manager">
              <ManagerStore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute requireRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminCustomers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managers"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminManagers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/store"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminStore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminAbout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/specials"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminSpecials />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App/>
  </BrowserRouter>
)

export default AppWrapper;

// //add imports for any new pages here
