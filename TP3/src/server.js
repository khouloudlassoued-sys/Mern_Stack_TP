const express = require ('express'); //#jebna express

const dotenv = require('dotenv');
const connectDB = require('../config/db');

const articleRoutes= require ('../routes/articleRoutes'); //#jebna l'api mte3na

const userRoutes = require ('../routes/userRoutes'); //#jebna l'api mte3na)

// Chargement des variables d'environnement (.env)
dotenv.config();


const app = express(); //#sna3na menha instance
const PORT = process.env.PORT || 3000;

//créer API traja3 lel client (te5ou lpath (ch de caractère) , w chnoua bech ta3mal (fonction cllback = chnoua yssir ki nediw lel get heki)) ===> traja3li liste
//nraj3ou lel user message Json fih " Bnjr ,.."=> ki nedi racine jewbni haka 9otlou
//puis nlanci serveur 
//fct callback aandha 2 parametre : req (request) w res (response) => ki yjini request n7otou fi req w ki n7eb njawb n7otou fi res

//9olnelou ki tetlanca ektebli : ' serveur dispo ' =>  backticks + &{ } ya3ni => chyaffichiha variable ``

app.use(express.json()) ; //middleware : permet de parser le body des requêtes en JSON

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






/* //sna3na une autre api
// GET / api/ articles -> tous les articles
app . get('/api/articles', (req , res) => {
res . json ({ total : articles.length , articles : articles }) ;
}) ;


//find tlawajli fi wost tableau articles 3la article li id mte3ou = id mte3 request
// GET / api/ articles /2 -> l'article dont l'id vaut 2
app . get('/api/articles/:id', ) ;

// GET / api/ articles -> tous les articles
// GET / api/ articles ? author = Aya -> seulement ceux d'Aya
app . get('/api/articles');


let prochainId = 4 ; // pour générer un id unique pour chaque nouvel article
app.post('/api/articles')







// 4. démarrer le serveur : il attend les requêtes sur le port 3000
app.listen(Port, ()=> {
    console.log(`serveur dispo sur le port ${Port}`) ;
}); 


//----------------------------EX2 : destructuration d'objet et de tableau ----------------------------

const produits = [
    {nom: 'Clavier', prix:45 },
    {nom: 'Ecran', prix: 320},
    {nom:'Souris', prix:25}
]

// Pratie1 =>  Desctructuration : extraire les propriétés nom et prix du premier élément du tableau produits
const {nom, prix} = produits[0];
console.log(nom, prix);

//Partie 2 => Find
const produit_Souris = produits.find(p => p.nom === 'Souris');
console.log(produit_Souris.prix);

//Partie3 => Filter 
const prixInf = produits.filter(p=> p.prix < 100);
console.log(prixInf);

//Partie 4 : Fonction fléchée 
const avecRemise = prix => prix*0.90;
console.log(avecRemise(10));







*/