import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import AdminRestaurantForm from './pages/AdminRestaurantForm';
import AdminPlatForm from './pages/AdminPlatForm';
import LivreurDashboard from './pages/LivreurDashboard';
import QRScanner from './pages/QRScanner';
import Navbar from './components/Navbar';
import './styles/theme.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const clientId = localStorage.getItem('clientId');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!clientId);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <Navbar userRole={userRole} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />

        <Route path="/admin/restaurant/add" element={<AdminRestaurantForm />} />
        <Route path="/admin/restaurant/edit/:id" element={<AdminRestaurantForm />} />
        <Route path="/admin/restaurants" element={<RestaurantList isAdmin={true} />} />
        <Route path="/admin/plat/add/:restaurantId" element={<AdminPlatForm />} />
        <Route path="/admin/plat/edit/:platId/restaurant/:restaurantId" element={<AdminPlatForm />} />

        <Route path="/livreur/dashboard" element={<LivreurDashboard />} />
        <Route path="/livreur/scan/:commandeId" element={<QRScanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;