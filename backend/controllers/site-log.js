const SQL = require('sql-template-strings');
const db = require('../utils/database').db;
const { handleError } = require('./common/error-handler');

async function getLast50Entries (req, res) {
    try {
        const entries = await db.all(SQL`SELECT sl.id, sl.time, u.nick, sl.act, sl.original, sl.new FROM sitelog sl INNER JOIN user u ON sl.user_id = u.id ORDER BY sl.time DESC LIMIT 50;`);
        res.json({
            success: true,
            data: entries
        });
    } catch (err) {
        console.error(err);
        handleError(res);
    }
}

module.exports = {
    getLast50Entries
};
