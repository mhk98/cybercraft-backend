const express = require('express')
const ContactController = require('../controllers/contact.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', ContactController.getAllContact);
router.post('/create', ContactController.createContact);



module.exports = router