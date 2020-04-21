const SQL = require('sql-template-strings');
const db = require('../utils/database').db;
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun } = docx;
const { handleError } = require('./common/error-handler');

async function getAllBands(req, res) {
    try {
        const bands = await db.all(`SELECT id, name, foundation_year, members, description FROM band;`);
        res.json({
            success: true,
            data: bands
        });
    } catch (err) {
        return handleError(res);
    }
}

async function getBandById(req, res) {
    try {
        const { id } = req.params;
        const band = await db.get(SQL`SELECT id, name, foundation_year, members, description FROM band WHERE id=${id};`);

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
        handleError(res);
    }
}

async function modifyBand(req, res) {
    const { id } = req.params;
    const { name, foundation_year, members, description } = req.body;
    let band;

    try {
        band = await db.get(SQL`SELECT id FROM band WHERE id=${id}`);
    } catch (err) {
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

async function exportBands(req, res) {
    let bands;

    try {
        bands = await db.all(`SELECT id, name, foundation_year, members, description FROM band;`);
    } catch (err) {
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

module.exports = {
    getAllBands,
    getBandById,
    modifyBand,
    createBand,
    exportBands
};
