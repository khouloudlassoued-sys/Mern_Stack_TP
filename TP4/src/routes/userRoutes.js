const express = require('express'); //#jebna express
const router = express.Router();
const userController = require('../controllers/userController');

// Les middlewares de sécurité
// protect   → vérifie le token (sinon 401)
// adminOnly → vérifie role === 'admin' (sinon 403)
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// ================================================================
//  Routes PUBLIQUES : pas de token (on ne peut pas exiger un token pour en obtenir un !)
// ================================================================
router.post('/register', userController.registerUser); // POST /api/users/register
router.post('/login', userController.loginUser);       // POST /api/users/login


// ================================================================
// Route PRIVÉE : token valide obligatoire
// ================================================================
router.get('/profile', protect, userController.getUserProfile); // GET /api/users/profile


// Exercice 1==> Changement de mot de passe : utilisateur connecté uniquement
// Route FIXE → déclarée avant les routes dynamiques '/:id'
router.put('/update-password', protect, userController.updatePassword) ;


// Exercice 2 ==> Changer le rôle d'un utilisateur : admin uniquement
router.put('/:id/role', protect, adminOnly, userController.updateUserRole); // PUT /api/users/:id/role


// ================================================================
//  Routes ADMIN : token valide + role 'admin'
// Ordre : protect (qui es-tu ?) → adminOnly (as-tu le droit ?) → contrôleur
// ================================================================
router.get('/', protect, adminOnly, userController.getUsers);         // GET    /api/users
router.get('/:id', protect, adminOnly, userController.getUserById);   // GET    /api/users/:id
router.post('/', protect, adminOnly, userController.createUser);      // POST   /api/users
router.delete('/:id', protect, adminOnly, userController.deleteUser); // DELETE /api/users/:id





module.exports = router;