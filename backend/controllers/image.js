const SQL = require('sql-template-strings');
const db = require('../utils/database').db;

const { handleError } = require('./common/error-handler');

const logger = require('./common/site-logger');
const acts = require('./common/log-acts');

async function getImagesOfBand (req, res) {
    const bandId = req.params.id;

    try {
        const images = await db.all(SQL`SELECT id, band_id, url FROM image WHERE band_id=${bandId}`);
        res.json({
            success: true,
            data: images
        });
    } catch(err) {
        console.error(err);
        handleError(err);
    }
    
}

async function createImage(req, res) {
    const image = req.body;

    if (!image.band_id) {
        return res.status(400).json({
            success: false,
            error: 'You can\'t upload image for an undefined band.'
        });
    }

    if (!image.url || !image.url.startsWith("https:\/\/i.imgur.com\/")) {
        return res.status(400).json({
            success: false,
            error: 'Image URL is not proper.'
        });
    }

    try {
        const { stmt } = await db.run(SQL`INSERT INTO image (band_id, url) VALUES (${image.band_id}, ${image.url})`);
        const savedImage = await db.get(SQL`SELECT id, band_id, url FROM image WHERE id=${stmt.lastID};`);
        await logger.log(req.user.id, acts.CREATE, null, savedImage);
        res.json({
            success: true,
            data: savedImage
        });
    } catch (err) {
        console.error(err);
        handleError(err);
    }
}

async function deleteImage(req, res) {
    const id = req.params.id;

    try {
        const image = await db.get(SQL`SELECT id, band_id, url FROM image WHERE id=${id};`);

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'The image is not exists.'
            });
        }

        await db.run(SQL`DELETE FROM image WHERE id=${image.id}`);
        await logger.log(req.user.id, acts.DELETE, image, null);

        res.json({
            success: true
        });
    } catch (err) {
        console.error(err);
        handleError(err);
    }
}

module.exports = {
    getImagesOfBand,
    createImage,
    deleteImage
};
