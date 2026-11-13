//  Bibliothèques de sécurité
const bcrypt = require('bcryptjs');       // hachage des mots de passe
const jwt = require('jsonwebtoken');      // création et vérification des tokens JWT

// On importe le modèle User (créé à l'étape 4) :
// il nous donne find(), findById(), create()...
const User = require('../models/userModel');

//On importe aussi le modèle Article : pour vérifier si l'utilisateur a des articles avant de le supprimer
const Article = require('../models/articleModel');

// ================================================================
// Utilitaire : génération d'un token JWT
// ================================================================
const generateToken = (id, role) => {
    // Payload : uniquement des données NON sensibles (lisible par tous sur jwt.io)
    // Signé avec JWT_SECRET → infalsifiable sans la clé
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d' // expire au bout de 24 h
    });
};

// ================================================================
// (POST /api/users/register) => Inscription
// ================================================================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        // 1. Champs obligatoires présents ?
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nom, email et mot de passe requis' });
        }

        // 2. L'email est-il déjà utilisé ? → 409 Conflict
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'Cet email est deja utilise' });
        }

        // 3. Hachage : on génère un sel aléatoire (coût 10 = 2^10 tours), puis on hache
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // → "$2a$10$..." (60 caractères)

        // 4. Création en base, avec le HASH et non le mot de passe en clair
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            role: 'user'
        });

        // 5. Réponse 201 : on renvoie les infos utiles + un token (connexion automatique après inscription)
        //    On ne renvoie jamais le mot de passe
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (err) {
        // Erreur de validation Mongoose (email mal formé, âge < 4, rôle invalide…) → 400
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message }); // erreur inattendue
    }
};

// ================================================================
//Connexion (POST /api/users/login)
// ================================================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        // 1. Recherche de l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            // Message vague volontaire : on ne révèle pas si l'email existe (anti-énumération)
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // 2. compare() extrait le sel du hash, re-hache la saisie, compare en temps constant
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' }); // même message
        }

        // 3. Succès → remise du token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
//Profil de l'utilisateur connecté (GET /api/users/profile) → route protégée protect
// ================================================================
const getUserProfile = async (req, res) => {
    try {
        // Pas besoin d'interroger la base : protect a déjà mis l'utilisateur dans req.user
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================================================================
//Mise à Jour du Mot de passe (PUT /api/users/update-password) => protect
// ================================================================

const updatePassword = async (req, res) => {

    try {
        //1.Recupération des 2 champs envoyés dans le body
        const { oldPassword, newPassword } = req.body;

        //2.les 2 champs sont obligatoires
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'oldPassword et newPassword sont Obligatoires(requis)' }); //400=bad request
        }

        //3.vérification de la longueur avant le hachage (hash fait 60 caractère)
        if (newPassword.length < 6) { // [corrigé] lenght → length
            return res.status(400).json({ message: 'Le nouveau mot de passe doit comporter au moins 6 caractères' });
        }

        //4.req.user ne contient pas le password
        //--> on recharge l'utilisateur depuis la base , avec son hash
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouve' });
        }

        //5.L ancien mot de passe est il correct ??
        const isMatch = await bcrypt.compare(oldPassword, user.password); // [corrigé] bycrypt → bcrypt
        if (!isMatch) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }

        //6.Nouveau sel + hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);                 // [corrigé] bycrypt.gensalt → bcrypt.genSalt
        user.password = await bcrypt.hash(newPassword, salt);  // [corrigé] bycrypt → bcrypt

        //7. save applique les validateurs du schéma puis enregistre en base
        await user.save();

        //8.succès => 200 okk , sans renvoyer le mot de passe
        res.status(200).json({ message: 'Mot de passe mis a jour avec succes' });

    } catch (err) {
        if (err.name === 'ValidationError') { // [corrigé] 'validationError' → 'ValidationError' + ===
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message }); //erreur imprévue
    }
};


// ================================================================
// Exercice2 ==> Modifier le rôle d'un utilisateur (PUT /api/users/:id/role) → protect + adminOnly
// ================================================================
const updateUserRole = async (req, res) => {
    try {
        // 1. Le nouveau rôle souhaité
        const { role } = req.body;

        // 2. Valeur autorisée ? (même liste que l'enum du schéma)
        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Le role doit etre 'user' ou 'admin'" });
        }

        // 3. Sécurité : un admin ne modifie pas son propre rôle
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre role' });
        }

        // 4. L'utilisateur ciblé existe-t-il ?
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouve' });
        }

        // 5. Mise à jour du rôle UNIQUEMENT (pas de req.body entier → pas de mass assignment)
        user.role = role;
        await user.save(); // applique la validation "enum" du schéma

        // 6. Réponse sans le hash du mot de passe
        res.status(200).json({
            message: `Role mis a jour : ${user.name} est maintenant '${user.role}'`,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        // id mal formé
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }
        res.status(500).json({ message: err.message });
    }
};



// ================================================================
// 1. Créer un nouvel utilisateur (POST /api/users)
// "async" -> la fonction peut utiliser "await" et renvoie une Promesse
// Doublon de registerUser : à réserver aux admins dans les routes (protect, adminOnly)
// ================================================================
const createUser = async (req, res) => {
    try {
        // Destructuration : on récupère les champs envoyés dans le body JSON (Postman)
        const { name, email, password, age, role, bio, phone } = req.body;

        // Vérification manuelle rapide : name et email sont indispensables
        //password devient lui aussi obligatoire
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Le nom, l'email et le mot de passe sont requis" }); // 400 = Bad Request
        }

        // Vérification de doublon : existe-t-il déjà un user avec cet email ?
        // "await" met la fonction en pause jusqu'à la réponse de MongoDB (sans bloquer le serveur)
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'Cet email est deja utilise' }); // 409 = Conflict
        }

        // Hachage du mot de passe avant l'enregistrement (avant : stocké en clair !)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create() = valide les données selon le schéma (regex, min, enum...) PUIS insère dans MongoDB
        const user = await User.create({ name, email, password: hashedPassword, age, role, bio, phone });

        // On retire le hash de la réponse
        const userSansPassword = user.toObject();
        delete userSansPassword.password;

        res.status(201).json(userSansPassword);
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
// getAllUsers du TP → route protégée par protect + adminOnly
// ================================================================
const getUsers = async (req, res) => {
    try {
        // find() sans filtre -> renvoie TOUS les documents de la collection "users"
        // [S4] .select('-password') -> on exclut le hash de la réponse
        const users = await User.find().select('-password');
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
        // [S4] .select('-password') -> pas de hash dans la réponse
        const user = await User.findById(req.params.id).select('-password');

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
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouve' }); //404 not found
        }
        //etape2: Integrité refrentielle !!!!m
        //on cherche un article dont le champ "author contien l'Id de cet utilisateur
        //findOne() renvoie le premier trouvé , ou null s il y en a aucun
        const article = await Article.findOne({ author: req.params.id });
        if (article) {
            return res.status(400).json({ message: 'Impossible de supprimer un utilisateur ayant des articles publies' });
        }

        //etape 3: aucune dépendance -> suppression autorisée
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Utilisateur supprime avec succes', id: req.params.id });

    } catch (err) {
        //id mal formé
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant de ressource invalide (format ObjectId attendu)' });
        }
        res.status(500).json({ message: err.message });
    }
};

// On exporte les fonctions pour que userRoutes.js puisse les utiliser
// [S4] + registerUser, loginUser, getUserProfile
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updatePassword,
    updateUserRole,   //Ex 2
    createUser,
    getUsers,
    getUserById,
    deleteUser
};


//// le contrôleur gère maintenant l’inscription, la connexion et le profil, en plus du CRUD existant.
// Plus aucun mot de passe n’est stocké en clair, ni renvoyé dans une réponse.
///Le hachage est bien géré dans le contrôleur, pas dans le modèle.
