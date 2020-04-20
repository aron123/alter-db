const express = require('express');
const router = express.Router();
const controller = require('../controllers/band');

router.get('/', controller.getAllBands);
router.get('/export', controller.exportBands);
router.get('/:id', controller.getBandById);
router.put('/:id', controller.modifyBand);

module.exports = router;
