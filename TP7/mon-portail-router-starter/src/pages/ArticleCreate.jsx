import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ArticleCreate() {
  const [categorie, setCategorie] = useState('Architecture');
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();                       // pour rediriger après l'envoi

  const handleSubmit = async (e) => {
    e.preventDefault();                                 // empêche le rechargement de la page
    if (!titre.trim() || !contenu.trim()) {
      setErreur('Veuillez remplir le titre et le contenu.');
      return;
    }
    try {
      // Ton backend lit req.body.title et req.body.content (pas titre/contenu)
      await api.post('/articles', { title: titre, content: contenu, category: categorie });
      navigate('/articles');                            // succès : retour à la liste (GET relancé)
    } catch (err) {
      // 401 sans jeton, 400 champs invalides... : on affiche le message du serveur
      setErreur(err.response?.data?.message || 'Impossible de publier : serveur injoignable.');
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', background: 'white', padding: '26px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Publier un Nouvel Article</h2>
      {erreur && <p style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>{erreur}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>Titre</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>Categorie</label>
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option value="Architecture">Architecture</option>
            <option value="Front-End">Front-End</option>
            <option value="Back-End">Back-End</option>
            <option value="Cybersecurite">Cybersecurite</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>Contenu</label>
          <textarea rows="4" value={contenu} onChange={(e) => setContenu(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>
        <button type="submit" className="btn-primary">Enregistrer sur Express</button>
      </form>
    </div>
  );
}