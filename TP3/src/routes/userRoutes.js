const express = require('express'); //#jebna express
const router = express.Router();
const userController = require('../src/controllers/userController');


router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);



module.exports = router;