


let articles = [
{ id: 1 , title : 'Bienvenue sur le blog ', author : 'Admin'} ,
{ id: 2 , title : 'Mon premier serveur Express ', author : 'Aya' } ,
{ id: 3 , title : 'Tester une API avec Postman ', author : 'Aya' }
];

let prochainId = 4;

const getAllarticles =  (req , res) => {
    const {author} = req.query ; // req.query.author extraire une ou plusieurs propriétés d un objet;
    let resultat = articles ;
    if ( author ) { // si le client a précisé ? author =...

        resultat = articles.filter (a => a.author == author ) ; //retourne un tableau avec ts les éléments qui respectent la condition
        }

    res.json ({ total : resultat.length , articles : resultat }) ;
} ;



const getArticleById = (req , res) => {

    const id = Number(req.params.id) ; // "2" -> 2
    const article = articles.find (a => a.id === id) ;
    //si l 'article n'existe pas (undefined) => raja3li 404
    if (! article ) {
        return res.status(404).json ({ error : 'Article ${id} introuvable ' }) ;
        }
    res.status (200).json (article) ;;
};



const CreateArticle = (req, res) => { 

    const { title, author } = req.body ; // destructuring : extraire les propriétés title et author de l'objet req.body]
    
    if(!title || !author) {
        return res.status(400).json({error : "Le titre et l'auteur sont obligatoires"});
        }

    const nouvelArticle= {id: prochainId, title : title, author : author};
    prochainId= prochainId+1;
    articles.push(nouvelArticle);
    res.status(201).json({message: 'Article crée', article: nouvelArticle});

}

// 4. Mettre à jour un article existant (PUT /api/ articles /: id)
const updateArticle = (req, res) => {
    const id = Number (req.params.id);
    const {title, author} = req.body;

    //rechercher l Index de l article dans le tableau 
    const index = articles.findIndex (a => a.id === id);

    if (index === -1) {
        return res.status(404).json ({ error: `Artcile ${id} introuvable` });
    }

    if(title) articles[index].title = title; 
    if(author) articles[index].author = author;

    res.status(200).json({message: 'Article mis à jour', article: articles[index]});
}

//Methode delete 
const deleteArticle= (req, res) => {
    const id = Number ( req.params.id) ;
    const articleExiste = articles.some (a=> a.id ===id);

    if (!articleExiste) {
        return res.status(404).json ({ error: `Article ${id} introuvable` });
    }
    //on filtre pour ne garder que les articles ayant un ID diff
    articles = articles.filter (a=> a.id !== id) ;
    res.status(200).json({message: `Article ${id} supprimé avec succès`});

}



// Exportation CommonJS : on rend ces fonctions publiques
module.exports = {
getAllarticles ,
getArticleById ,
CreateArticle,
updateArticle,
deleteArticle
};




