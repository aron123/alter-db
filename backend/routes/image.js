const express = require('express');
const router = express.Router();
const controller = require('../controllers/image')

router.get('/band/:id', controller.getImagesOfBand);
router.post('/', controller.createImage);
router.delete('/:id', controller.deleteImage);

module.exports = router;
