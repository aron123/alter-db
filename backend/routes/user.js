const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.post('/register', controller.createUser);
router.post('/activate/:key', controller.activateUser);
router.post('/login', controller.loginUser);

module.exports = router;
