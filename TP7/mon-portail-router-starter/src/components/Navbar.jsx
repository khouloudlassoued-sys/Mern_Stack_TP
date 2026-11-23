import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '14px 20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem' }}>Polytech Portal -- MERN S7</h1>
        <nav style={{ display: 'flex', gap: '8px' }}>
          {/* "end" : sans lui, Accueil resterait actif sur /articles (car "/" est le début de toute URL) */}
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Accueil
          </NavLink>
          <NavLink to="/articles" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Articles (API)
          </NavLink>
          <NavLink to="/nouveau" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            + Publier
          </NavLink>
        </nav>
      </div>
    </header>
  );
}