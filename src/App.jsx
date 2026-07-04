import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AppLock from './components/AppLock';
import GracefulExit from './components/GracefulExit';
import Navbar from './components/Navbar';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [subStatus, setSubStatus] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Birth of the Icon (Splash Screen)
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchStatus();
    }
  }, [user]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/subscription-status', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSubStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.clear();
      setUser(null);
      setIsExiting(false);
      navigate('/');
    }, 3000);
  };

  if (loading) return <SplashScreen />;
  if (isExiting) return <GracefulExit />;

  return (
    <div className="min-h-screen relative">
      {user && !subStatus?.isLocked && <Navbar user={user} onLogout={handleLogout} />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={user ? <Dashboard subStatus={subStatus} /> : <Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard subStatus={subStatus} />} />
        </Routes>
      </AnimatePresence>

      {subStatus?.isLocked && <AppLock />}
      
      <footer className="fixed bottom-4 right-4 text-[10px] uppercase tracking-widest text-luxury-gold opacity-50">
        Powered by Layboka
      </footer>
    </div>
  );
}
