# Séance 7 (Consolidée) -- Starter Étudiant : React Router SPA & Axios / Express

## Démarrage rapide (2 terminaux)

1. Installer les dépendances une seule fois :
   ```bash
   npm install
   ```
2. **Terminal 1 -- Lancer le serveur API Express + CORS (Port 5000) :**
   ```bash
   npm run server
   ```
3. **Terminal 2 -- Lancer le client React Vite (Port 5173) :**
   ```bash
   npm run dev
   ```

## Travail à réaliser pas-à-pas

### Volet 1 : Navigation Multi-Pages avec React Router
- **Étape 1 (`src/main.jsx`) :** Importer `BrowserRouter` et envelopper `<App />`.
- **Étape 2 (`src/components/Navbar.jsx`) :** Remplacer les balises `<a href>` par `<NavLink to="...">`.
- **Étape 3 (`src/layouts/RootLayout.jsx` & `src/App.jsx`) :** Placer `<Outlet />` dans `RootLayout.jsx`, puis déclarer `<Routes>` et les 5 `<Route>` dans `App.jsx`.

### Volet 2 : Communication Front-Back avec Axios
- **Étape 1 (`src/services/api.js`) :** **Créer manuellement** le dossier `src/services/` et le fichier `api.js` avec `axios.create({ baseURL: 'http://localhost:5000/api' })`.
- **Étape 2 (`src/pages/ArticleList.jsx`) :** Déclarer `[articles, loading, error]` et charger `GET /articles` avec `useEffect`.
- **Étape 3 (`src/pages/ArticleDetail.jsx`) :** Extraire `:id` avec `useParams()` et charger `GET /articles/:id`.
- **Étape 4 (`src/pages/ArticleCreate.jsx`) :** Envoyer `POST /articles` puis rediriger vers `/articles` avec `useNavigate()`.
