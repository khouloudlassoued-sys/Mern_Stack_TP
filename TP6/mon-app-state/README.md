# TechStore - Séance 6 (projet de départ)

## Lancer le projet

```
npm install
npm install @reduxjs/toolkit react-redux
npm run dev
```

Puis ouvrir http://localhost:5173

## Ce qui est déjà fait

- `src/context/ThemeContext.jsx` : le thème clair/sombre avec `useContext`
- `src/data/products.js` : les 4 produits du catalogue
- `src/components/` : `Navbar`, `ProductList` et `Cart`, avec des valeurs écrites en dur
- `src/index.css` : tout le style (à ne pas modifier)

## Ce que vous allez faire

- créer le dossier `src/redux/` et les fichiers `cartSlice.js` et `store.js`
- brancher le store dans `src/main.jsx`
- relier `Navbar`, `ProductList` et `Cart` au store

Suivez les étapes du document de la séance.
