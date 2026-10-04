const express = require ('express'); //#jebna express
const app = express(); //#sna3na menha instance 
//créer API traja3 lel client (te5ou lpath (ch de caractère) , w chnoua bech ta3mal (fonction cllback = chnoua yssir ki nediw lel get heki)) ===> traja3li liste
//nraj3ou lel user message Json fih " Bnjr ,.."=> ki nedi racine jewbni haka 9otlou
//puis nlanci serveur 
//fct callback aandha 2 parametre : req (request) w res (response) => ki yjini request n7otou fi req w ki n7eb njawb n7otou fi res

//9olnelou ki tetlanca ektebli : ' serveur dispo ' =>  backticks + &{ } ya3ni => chyaffichiha variable ``

const Port =3000;
app.use(express.json()) ; //middleware : permet de parser le body des requêtes en JSON

//loula ale racine
// 3. une route : quand un client demande GET / , Express exécute cette fonction
app.get('/', (req , res) => {res.json ({ message : " Bonjour koukou, je suis l’API du blog " }) ;
}) ;

const articles = [
{ id: 1 , title : 'Bienvenue sur le blog ', author : 'Admin'} ,
{ id: 2 , title : 'Mon premier serveur Express ', author : 'Aya' } ,
{ id: 3 , title : 'Tester une API avec Postman ', author : 'Aya' }
];


/* //sna3na une autre api
// GET / api/ articles -> tous les articles
app . get('/api/articles', (req , res) => {
res . json ({ total : articles.length , articles : articles }) ;
}) ;

 */
//find tlawajli fi wost tableau articles 3la article li id mte3ou = id mte3 request
// GET / api/ articles /2 -> l’article dont l’id vaut 2
app . get('/api/articles/:id', (req , res) => {

    const id = Number(req.params.id) ; // "2" -> 2
    const article = articles.find (a => a.id === id) ;
    //si l 'article n'existe pas (undefined) => raja3li 404
    if (! article ) {
        return res.status(404).json ({ error : 'Article ${id} introuvable ' }) ;
        }
    res.json(article) ;
}) ;

// GET / api/ articles -> tous les articles
// GET / api/ articles ? author = Aya -> seulement ceux d’Aya
app . get('/api/articles', (req , res) => {
    const {author} = req.query ; // req.query.author extraire une ou plusieurs propriétés d un objet;
    let resultat = articles ;
    if ( author ) { // si le client a précisé ? author =...

        resultat = articles.filter (a => a.author == author ) ; //retourne un tableau avec ts les éléments qui respectent la condition
        }

    res.json ({ total : resultat.length , articles : resultat }) ;
}) ;


let prochainId = 4 ; // pour générer un id unique pour chaque nouvel article
app.post('/api/articles', (req, res) => { 

    const { title, author } = req.body ; // destructuring : extraire les propriétés title et author de l'objet req.body]
    
    if(!title || !author) {
        return res.status(400).json({error : "Le titre et l'auteur sont obligatoires"});
    }

    const nouvelArticle= {id: prochainId, title : title, author : author};
    prochainId= prochainId+1;
    articles.push(nouvelArticle);
    res.status(201).json({message: 'Article crée', article: nouvelArticle});

})


//------------------EX1: compléter l’API (dans server.js, à tester avec Postman)----------------------------

//----------------------------★ GET /about-------------------------
app.get ('/about',(req,res) => {
    res.json ({

        application: "Blog API",
        utilisateur: "Khouloud",
        version:"1.0.1"
    });

});


    const users = [
        {id: 1, name: "Khouloud", email: "khouloud@example.com"},
        {id: 2, name: "Aya", email: "aya@example.com" },
        {id: 3, name: "Ahmed", email: "ahmed@example.com"}
    ]


//--------------------------★★ GET /api/users-------------------------------
app.get('/api/users',(req,res) => {
    const {name} = req.query;
    let result = users;
    if (name) {
        result = users.filter (u => u.name === name);
    }

    res.json({users: result});

} )
    

//--------------------------★★ GET /api/users/:id-------------------------------
app.get ('/api/users/:id', (req,res) =>{

    const id =Number (req.params.id);

    const user = users.find (u=> u.id ===id);
    if (!user) {
        res.status(404).json({error: `Utilisateur ${id} introuvable`});
    }

    res.json({user: user});
})

//--------------------------★★ POST /contact-------------------------------
app.post ('/contact', (req, res) => {

    const {email, message} =  req.body;

    if (!email || !message) {
        return res.status(400).json({error: "L'email et le message sont obligatoires"});
    }
    res.status(200).json({
        message: "Merci, votre message a bien été reçu" 
})

})


//--------------------------★★★★ Bonus : GET /api/users?name=Aya -------------------------------

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







