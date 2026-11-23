import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { showToast } from '../redux/uiSlice';

// Catalogue statique (pas d'état : simple constante)
const PRODUCTS = [
  { id: 1, name: 'Ecran UltraWide 4K 34"', price: 850, category: 'Affichage' },
  { id: 2, name: 'Clavier Mecanique RGB', price: 180, category: 'Peripherique' },
  { id: 3, name: 'Souris Sans Fil Ergonomique', price: 95, category: 'Accessoire' },
  { id: 4, name: 'Casque Haute Fidelite ANC', price: 320, category: 'Audio' }
];

export default function ProductList() {
  const dispatch = useDispatch();  // fonction qui envoie les actions au store

  // Un seul clic = deux actions envoyées au store
  const handleAdd = (product) => {
    dispatch(addItem(product));                                // 1) ajoute au panier (slice cart)
    dispatch(showToast(`${product.name} ajouté au panier`));   // 2) affiche la notification (slice ui)
  };

  return (
    <div className="product-grid">
      {PRODUCTS.map((product) => (
        <div key={product.id} className="product-card">
          <h4>{product.name}</h4>
          <span>{product.price} DT</span>
          {/* Flèche obligatoire : sinon handleAdd s'exécute pendant le rendu */}
          <button onClick={() => handleAdd(product)}>+ Ajouter</button>
        </div>
      ))}
    </div>
  );
}