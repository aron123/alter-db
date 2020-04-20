const SQL = require('sql-template-strings');
const db = require('../utils/database').db;
const docx = require('docx');

const { Document, Packer, Paragraph, TextRun } = docx;

function handleError(res) {
    res.status(500).json({
        success: false,
        error: 'Server error occurred.'
    });
}

async function getAllBands(req, res) {
    try {
        const bands = await db.all(`SELECT id, name, foundation_year, members, description FROM band;`);
        res.json({
            success: true,
            data: bands
        });
    } catch (err) {
        handleError(res);
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
        handleError(res);
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
        handleError(res);
    }

    res.json({ success: true });
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
    //TODO
    res.setHeader('Content-Disposition', 'attachment; filename=asd.docx');
    res.send(Buffer.from(b64string, 'base64'));
}

module.exports = {
    getAllBands,
    getBandById,
    modifyBand,
    exportBands
};
