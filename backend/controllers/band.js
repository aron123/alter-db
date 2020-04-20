const SQL = require('sql-template-strings');
const db = require('../utils/database').db;

function handleError (res) {
    res.status(500).json({
        success: false,
        error: 'Server error occurred.'
    });
}

async function getAllBands (req, res) {
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

async function getBandById (req, res) {
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

async function modifyBand (req, res) {
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

module.exports = {
    getAllBands,
    getBandById,
    modifyBand
};
