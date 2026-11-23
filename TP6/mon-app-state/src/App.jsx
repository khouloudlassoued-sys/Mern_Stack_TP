import React from 'react';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import NotificationToast from './components/NotificationToast';

export default function App() {
  // On lit le thème courant ('light' ou 'dark') depuis le Context
  const { theme } = useTheme();
  return (
    // Backticks obligatoires pour que ${theme} soit remplacé par sa valeur
    <div className={`app-wrapper ${theme}`}>
      <Navbar />
      <ProductList />
      <Cart />
      <NotificationToast />
    </div>
  );
}