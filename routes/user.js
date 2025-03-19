const express = require('express')
const UserController = require('../controllers/user.controller');
const router = express.Router();


router.post('/login', UserController.login);
router.post('/register', UserController.signup);



module.exports = router