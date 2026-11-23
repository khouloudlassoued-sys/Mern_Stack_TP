// [S4] Chargement des variables d'environnement EN PREMIER
const path = require('path');
const dotenv = require('dotenv');
// __dirname = TP3/src → '..' remonte vers TP3 → TP3/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require('express'); //#jebna express
const cors = require('cors');            // ← AJOUT : import du middleware CORS
const connectDB = require('./config/db'); // [S4] corrigé : db.js est dans src/config/

const articleRoutes = require('./routes/articleRoutes'); //#jebna l'api mte3na
const userRoutes = require('./routes/userRoutes');       //#jebna l'api mte3na

const app = express(); //#sna3na menha instance
const PORT = process.env.PORT || 3000;

//créer API traja3 lel client (te5ou lpath (ch de caractère) , w chnoua bech ta3mal (fonction cllback = chnoua yssir ki nediw lel get heki)) ===> traja3li liste
//nraj3ou lel user message Json fih " Bnjr ,.."=> ki nedi racine jewbni haka 9otlou
//puis nlanci serveur
//fct callback aandha 2 parametre : req (request) w res (response) => ki yjini request n7otou fi req w ki n7eb njawb n7otou fi res

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));

//9olnelou ki tetlanca ektebli : ' serveur dispo ' =>  backticks + &{ } ya3ni => chyaffichiha variable ``

app.use(express.json()); //middleware : permet de parser le body des requêtes en JSON

// Route d'accueil pour tester le statut général du serveur
app.get('/', (req, res) => {
  res.json({ message: "API du Blog - Serveur Modulaire Opérationnel (SoC)" });
});

//9oulou ay haja tabda b /api/articles emchi l articleRoutes.js
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

// Connexion asynchrone à MongoDB puis démarrage de l'écoute
(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Serveur MERN en ecoute sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur critique de demarrage du serveur :', err.message);
    process.exit(1);
  }
})();