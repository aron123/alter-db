const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.post('/register', controller.createUser);
router.post('/activate/:key', controller.activateUser);
router.post('/login', controller.loginUser);
router.get('/me', controller.getUser);
router.put('/password', controller.changePassword);

module.exports = router;
