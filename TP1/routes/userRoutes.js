const express = require ('express'); //#jebna express
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.CreateUser);
router.delete('/:id', userController.deleteUser);



module.exports = router;