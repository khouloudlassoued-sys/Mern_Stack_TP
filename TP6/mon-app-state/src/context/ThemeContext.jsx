import React, { createContext, useState, useContext, useEffect } from 'react';

// DÉCLARER : le "canal" qui transportera les données. Créé une seule fois, hors composant.
export const ThemeContext = createContext(null);

// FOURNIR : un composant qui possède l'état et le diffuse à ses enfants.
export function ThemeProvider({ children }) {
  // Fonction dans useState : exécutée une seule fois, au 1er rendu.
  // On relit le thème sauvegardé, sinon 'light'.
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  // À chaque changement de "theme", on le sauvegarde dans le navigateur.
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Fonction de modification, partagée avec tous les consommateurs.
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Tout ce qui est dans "value" devient accessible aux enfants.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé : raccourci + message clair si on oublie le Provider.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur d'un <ThemeProvider>");
  }
  return context; // { theme, toggleTheme }
}