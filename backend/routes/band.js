const express = require('express');
const router = express.Router();
const controller = require('../controllers/band');

router.get('/', controller.getAllBands);
router.get('/search', controller.searchBands);
router.get('/export/docx', controller.exportBandsToDocx);
router.get('/export/json', controller.exportBandsToJson);
router.get('/:id', controller.getBandById);
router.post('/', controller.createBand);
router.put('/:id', controller.modifyBand);

module.exports = router;
