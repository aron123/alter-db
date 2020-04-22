const SQL = require('sql-template-strings');
const db = require('../utils/database').db;

const docx = require('docx');
const { Document, Packer, Paragraph, TextRun } = docx;

const { handleError } = require('./common/error-handler');

const logger = require('./common/site-logger');
const acts = require('./common/log-acts');

function mergeImagesToBands (images, bands) {
    bands.forEach(band => band.images = []);

    for (let image of images) {
        const bandId = image.band_id;
        bands.filter(band => band.id === bandId).forEach(band => band.images.push(image));
    }

    return bands;
}

async function getImages (bandId) {
    return await db.all(SQL`SELECT id, url FROM image WHERE band_id=${bandId}`);
}

async function getAllBands(req, res) {
    try {
        const bands = await db.all(`SELECT id, name, foundation_year, members, description FROM band;`);
        const images = await db.all(SQL`SELECT id, url, band_id, thumbnail_url FROM image;`);
        const data = mergeImagesToBands(images, bands);

        res.json({
            success: true,
            data
        });
    } catch (err) {
        console.error(err);
        return handleError(res);
    }
}

async function getBandById(req, res) {
    try {
        const { id } = req.params;
        const band = await db.get(SQL`SELECT id, name, foundation_year, members, description FROM band WHERE id=${id};`);
        band.images = await getImages(band.id);

        if (!band) {
            return res.status(400).json({
                success: false,
                error: 'No band is exists with the given id.'
            });
        }

        res.json({
            success: true,
            data: band
        });
    } catch (err) {
        console.error(err);
        handleError(res);
    }
}

async function modifyBand(req, res) {
    const { id } = req.params;
    const { name, foundation_year, members, description } = req.body;
    let band;

    try {
        band = await db.get(SQL`SELECT * FROM band WHERE id=${id}`);
    } catch (err) {
        console.error(err);
        return handleError(res);
    }

    if (!band) {
        return res.status(400).json({
            success: false,
            error: 'No band is exists with the given id.'
        });
    }

    try {
        await db.run(SQL`UPDATE band SET name=${name}, foundation_year=${foundation_year}, members=${members}, description=${description} WHERE id=${id}`);
        await logger.log(req.user.id, acts.UPDATE, band, req.body);
    } catch (err) {
        return handleError(res);
    }

    res.json({ success: true });
}

async function createBand (req, res) {
    const band = req.body;

    if (!band.name) {
        return res.status(400).json({
            success: false,
            error: 'At least band name must be defined.'
        });
    }

    try {
        const { stmt } = await db.run(SQL`INSERT INTO band (name, foundation_year, members, description) VALUES (${band.name}, ${band.foundation_year}, ${band.members}, ${band.description});`);
        const insertedBand = await db.get(SQL`SELECT id, name, foundation_year, members, description FROM band WHERE id=${stmt.lastID}`);

        await logger.log(req.user.id, acts.CREATE, null, insertedBand);

        res.json({
            success: true,
            data: insertedBand
        });
    } catch (err) {
        if (err.errno === 19) {
            return res.status(400).json({
                success: false,
                error: `A band is already exists with the name: ${band.name}`
            });
        }

        return handleError(res);
    }
}

async function exportBandsToDocx(req, res) {
    let bands;

    try {
        bands = await db.all(`SELECT id, name, foundation_year, members, description FROM band ORDER BY name ASC;`);
    } catch (err) {
        console.error(err);
        handleError(res);
    }

    const doc = new Document();

    for (const band of bands) {
        doc.addSection({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: band.name,
                            bold: true,
                        })
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Alapítás éve: ",
                            bold: true
                        }),
                        new TextRun({
                            text: band.foundation_year
                        })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Tagok: ",
                            bold: true
                        }),
                        new TextRun({
                            text: band.members
                        })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Leírás: ",
                            bold: true
                        }),
                        new TextRun({
                            text: band.description
                        })
                    ]
                }),
                new Paragraph({
                    children: []
                })
            ],
        });
    }

    const b64string = await Packer.toBase64String(doc);
    res.setHeader('Content-Disposition', 'attachment; filename=alter.docx');
    res.send(Buffer.from(b64string, 'base64'));
}

async function exportBandsToJson(req, res) {
    try {
        const bands = await db.all(`SELECT id, name, foundation_year, members, description FROM band;`);
        res.setHeader('Content-Disposition', 'attachment; filename=alter.json');
        res.send(JSON.stringify(bands));
    } catch (err) {
        return handleError(res);
    }
}


module.exports = {
    getAllBands,
    getBandById,
    modifyBand,
    createBand,
    exportBandsToDocx,
    exportBandsToJson
};
