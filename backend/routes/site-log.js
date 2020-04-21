const express = require('express');
const router = express.Router();
const controller = require('../controllers/site-log');

router.get('/', controller.getLast50Entries);

module.exports = router;
