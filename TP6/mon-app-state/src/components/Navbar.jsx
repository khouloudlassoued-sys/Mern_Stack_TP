import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();                          // thème : Context
  const totalCount = useSelector((state) => state.cart.totalCount);   // panier : Redux

  return (
    <nav className="navbar">
      <h2>TechStore <span className="badge-mern">MERN S6</span></h2>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}
      </button>
      <span className="badge-count">{totalCount}</span>
    </nav>
  );
}