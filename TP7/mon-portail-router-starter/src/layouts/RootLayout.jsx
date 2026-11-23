import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Écrit une seule fois : reste affiché sur toutes les pages */}
      <Navbar />
      <main className="container" style={{ flex: 1, padding: '28px 16px' }}>
        {/* Outlet = emplacement où React Router injecte la page active */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}