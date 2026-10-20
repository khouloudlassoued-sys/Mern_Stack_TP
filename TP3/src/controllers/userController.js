
// On importe le modèle User (créé à l'étape 4) :
// il nous donne find(), findById(), create()...
const User = require('../models/userModel');

// (Exercice 1) On importe aussi le modèle Article : pour vérifier si l'utilisateur a des articles avant de le supprimer
const Article = require('../models/articleModel');

// ================================================================
// 1. Créer un nouvel utilisateur (POST /api/users)
// "async" -> la fonction peut utiliser "await"                                                                                                                                                                                            et renvoie une Promesse
const createUser = async (req, res) => {
    try {
        // Destructuration : on récupère les champs envoyés dans le body JSON (Postman)
        const { name, email, password, age, role, bio, phone} = req.body;

        // Vérification manuelle rapide : name et email sont indispensables
        if (!name || !email) {
            return res.status(400).json({ message: "Le nom et l'email sont requis" }); // 400 = Bad Request
        }

        // Vérification de doublon : existe-t-il déjà un user avec cet email ?
        // "await" met la fonction en pause jusqu'à la réponse de MongoDB (sans bloquer le serveur)
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'Cet email est deja utilise' }); // 409 = Conflict
        }

        // create() = valide les données selon le schéma (regex, min, enum...) PUIS insère dans MongoDB
        const user = await User.create({ name, email, password, age, role, bio, phone });
        res.status(201).json(user);
        // 201 = Created -> on renvoie le document créé (avec son _id, createdAt, updatedAt)

    } catch (err) {
        // Si le schéma refuse les données (email invalide, age < 4, role inconnu) -> ValidationError
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message }); // erreur du client -> 400
        }
        // Toute autre erreur (réseau, base indisponible...) -> erreur serveur
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 2. Obtenir tous les utilisateurs (GET /api/users)
// ================================================================
const getUsers = async (req, res) => {
    try {
        // find() sans filtre -> renvoie TOUS les documents de la collection "users"
        const users = await User.find();
        res.status(200).json(users); // 200 = OK
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
// 3. Obtenir un utilisateur par son identifiant (GET /api/users/:id)
// ================================================================
const getUserById = async (req, res) => {
    try {
        // req.params.id = la partie :id de l'URL (ex: /api/users/665b9... -> "665b9...")
        // findById() cherche le document dont le _id correspond
        const user = await User.findById(req.params.id);

        // findById renvoie null si aucun document ne correspond
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouve' }); // 404 = Not Found
        }
        res.status(200).json(user);
    } catch (err) {
        // (Exercice 2 : on traitera ici le cas CastError -> 400)
        res.status(500).json({ message: err.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        //etape 1 : does user exists ???
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status (404).json ({ message: 'Utilisateur non trouve'}); //404 not found
        }
        //etape2: Integrité refrentielle !!!!m
        //on cherche un article dont le champ "author contien l'Id de cet utilisateur
        //findOne() renvoie le premier trouvé , ou null s il y en a aucun
        const article = await Article.findOne ({ author: req.params.id});
        if(article) {
            return res.status(400).json({ message: 'Impossible de supprimer un utilisateur ayant des articles publies' });
        }

        //etape 3: aucune dépendance -> suppression autorisée
        await User.findByIdAndDelete(req.params.id) ;
        res.status(200).json({ message: 'Utilisateur supprime avec succes', id: req.params.id });

    } catch (err) {
        //id mal formé
        if(err.name == 'CastError') {
            return res.status(400).json({ message: 'Identifiant de ressource invalide (format ObjectId attendu)' });
        }
        res.status(500).json({ message: err.message });


    }
}

// On exporte les fonctions pour que userRoutes.js puisse les utiliser
module.exports = { createUser, getUsers, getUserById ,deleteUser};




/* const { estNonVide, estEmailValide } = require('../utils/validators');


let users = [
        {id: 1, name: "Khouloud", email: "khouloud@example.com", role :"Ingenieur"},
        {id: 2, name: "Aya", email: "aya@example.com", role :"Etudiant" },
        {id: 3, name: "Ahmed", email: "ahmed@example.com", role :"Enseignant"}
        ]

let prochainId = 5;


const getAllUsers =(req,res) => {
    const {name} = req.query;
    let result = users;
    if (name) {
        result = users.filter (u => u.name === name);
    }

    res.json({users: result});

}

const getUserById = (req,res) =>{

    const id =Number (req.params.id);
    const user = users.find (u=> u.id ===id);
    if (!user) {
        res.status(404).json({error: `Utilisateur ${id} introuvable`});
    }

    res.json({user: user});
}

//validation obligatoire de name et email, statut 201
const CreateUser = (req, res) => {
    const {name, email, role} = req.body; //  destructuring : extraire les propriétés name et email de l'objet req.body]

    if (!estNonVide(name)) {
        return res.status(400).json({ error: "Le nom est obligatoire et ne peut pas être vide" });
    }
    if (!estEmailValide(email)) {
        return res.status(400).json({ error: "L'email est invalide (il doit contenir @ et .)" });
    }

    const newUser = {id:prochainId, name: name, email:email, role:role};
    prochainId = prochainId+1 ; 
    users.push(newUser);
    res.status(201).json({message: 'Utilisateur créé', user: newUser});

}



//Methode delete 
const deleteUser= (req, res) => {
    const id = Number ( req.params.id) ;
    const UserExiste = users.some (a=> a.id ===id);

    if (!UserExiste) {
        return res.status(404).json ({ error: `User ${id} introuvable` });
    }
    //on filtre pour ne garder que les articles ayant un ID diff
    users = users.filter (a=> a.id !== id) ;
    res.status(200).json({message: `User ${id} supprimé avec succès`});

}



module.exports = {
    getAllUsers,
    getUserById,
    CreateUser,
    deleteUser,

}
*/
