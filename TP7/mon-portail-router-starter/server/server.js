import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// 1. Autoriser les requetes cross-origin depuis le client React Vite (:5173)
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));

// 2. Parser automatiquement le corps JSON des requetes POST
app.use(express.json());

// Base d'articles initiale (simulant la collection MongoDB)
let articles = [
  {
    id: 1,
    titre: "L'essor du MERN Stack en 2026",
    auteur: 'Dr. Gueddes',
    categorie: 'Architecture',
    contenu: 'Le couplage de Node.js, Express, MongoDB et React permet de construire des applications Single-Page reactives et modulaires.'
  },
  {
    id: 2,
    titre: 'Securite Stateless avec JWT',
    auteur: 'Ing. Slim',
    categorie: 'Cybersecurite',
    contenu: 'Les jetons signes cryptographiquement remplacent les sessions serveur en memoire et facilitent la montee en charge.'
  },
  {
    id: 3,
    titre: 'Flux Unidirectionnel Redux Toolkit',
    auteur: 'Dr. Gueddes',
    categorie: 'Front-End',
    contenu: 'Utilisation conjointe de createSlice et Immer pour garantir des mises a jour d etat predictibles et tracables.'
  },
  {
    id: 4,
    titre: 'Communication Asynchrone avec Axios',
    auteur: 'Dr. Gueddes',
    categorie: 'Back-End',
    contenu: 'Une instance Axios centralisee simplifie les appels HTTP GET, POST et DELETE entre React Router et Express.'
  }
];

// GET /api/articles : Retourne la liste complete
app.get('/api/articles', (req, res) => {
  res.status(200).json(articles);
});

// GET /api/articles/:id : Retourne un article par son identifiant
app.get('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return res.status(404).json({ message: 'Article introuvable sur le serveur.' });
  }
  res.status(200).json(article);
});

// POST /api/articles : Ajoute un nouvel article
app.post('/api/articles', (req, res) => {
  const { titre, categorie, contenu, auteur } = req.body;
  if (!titre || !contenu) {
    return res.status(400).json({ message: 'Le titre et le contenu sont obligatoires.' });
  }
  const nouvelArticle = {
    id: Date.now(),
    titre,
    categorie: categorie || 'Architecture',
    auteur: auteur || 'Etudiant Polytechnique',
    contenu
  };
  articles = [nouvelArticle, ...articles];
  res.status(201).json(nouvelArticle);
});

// DELETE /api/articles/:id : Supprime un article
app.delete('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  articles = articles.filter((a) => a.id !== id);
  res.status(200).json({ message: 'Article supprime avec succes.', id });
});

app.listen(PORT, () => {
  console.log(`[API Express + CORS] Serveur actif sur http://localhost:${PORT}/api/articles`);
});
