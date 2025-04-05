const express = require('express');
const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');
const jwtMiddleware = require('../middleware/authMiddleware');//for validate request
const { validateRegistration, validateLogin, validateClientCreate, validateAddUser, validateId } = require('../middleware/validateAuth');

const router = express.Router();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/create-client', jwtMiddleware, validateClientCreate, clientController.createProfile);
router.post('/add-user', jwtMiddleware, validateAddUser, clientController.addUser);
router.post('/get-user', jwtMiddleware, validateId, clientController.getUser);

module.exports = router;
