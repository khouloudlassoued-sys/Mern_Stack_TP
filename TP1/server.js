const express = require ('express'); //#jebna express
const articleRoutes= require ('./routes/articleRoutes'); //#jebna l'api mte3na  

const userRoutes = require ('./routes/userRoutes'); //#jebna l'api mte3na)

const app = express(); //#sna3na menha instance 
//créer API traja3 lel client (te5ou lpath (ch de caractère) , w chnoua bech ta3mal (fonction cllback = chnoua yssir ki nediw lel get heki)) ===> traja3li liste
//nraj3ou lel user message Json fih " Bnjr ,.."=> ki nedi racine jewbni haka 9otlou
//puis nlanci serveur 
//fct callback aandha 2 parametre : req (request) w res (response) => ki yjini request n7otou fi req w ki n7eb njawb n7otou fi res

//9olnelou ki tetlanca ektebli : ' serveur dispo ' =>  backticks + &{ } ya3ni => chyaffichiha variable ``

const Port =3000;
app.use(express.json()) ; //middleware : permet de parser le body des requêtes en JSON

//9oulou ay haja tabda b /api/articles emchi l articleRoutes.js 
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
// Route d'accueil pour tester le statut général du serveur


app.get('/', (req, res) => {
  res.json({ message: "API du Blog - Serveur Modulaire Opérationnel (SoC)" });
});

app.listen(Port, () => {
  console.log(`Serveur modulaire en écoute sur http://localhost:${Port}`);
});








/* //sna3na une autre api
// GET / api/ articles -> tous les articles
app . get('/api/articles', (req , res) => {
res . json ({ total : articles.length , articles : articles }) ;
}) ;

 
//find tlawajli fi wost tableau articles 3la article li id mte3ou = id mte3 request
// GET / api/ articles /2 -> l’article dont l’id vaut 2
app . get('/api/articles/:id', ) ;

// GET / api/ articles -> tous les articles
// GET / api/ articles ? author = Aya -> seulement ceux d’Aya
app . get('/api/articles');


let prochainId = 4 ; // pour générer un id unique pour chaque nouvel article
app.post('/api/articles')


//------------------EX1: compléter l’API (dans server.js, à tester avec Postman)----------------------------

app.get ('/about',(req,res) => {
    res.json ({

        application: "Blog API",
        utilisateur: "Khouloud",
        version:"1.0.1"
    });

});


    const users = [
        {id: 1, name: "Khouloud", email: "khouloud@example.com", role :"Ingenieur"},
        {id: 2, name: "Aya", email: "aya@example.com", role :"Etudiant" },
        {id: 3, name: "Ahmed", email: "ahmed@example.com", role :"Enseignant"}
    ]


app.get('/api/users',(req,res) => {
    const {name} = req.query;
    let result = users;
    if (name) {
        result = users.filter (u => u.name === name);
    }

    res.json({users: result});

} )
    

app.get ('/api/users/:id', (req,res) =>{

    const id =Number (req.params.id);

    const user = users.find (u=> u.id ===id);
    if (!user) {
        res.status(404).json({error: `Utilisateur ${id} introuvable`});
    }

    res.json({user: user});
})

app.post ('/contact', (req, res) => {

    const {email, message} =  req.body;

    if (!email || !message) {
        return res.status(400).json({error: "L'email et le message sont obligatoires"});
    }
    res.status(200).json({
        message: "Merci, votre message a bien été reçu"
})

})



app.get('/api/users', (req, res) => {

    const { name } = req.query;

    let resultat = users;

    if (name) {
        resultat = users.filter(u => u.name === name);
    }

    res.json(resultat);
});






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