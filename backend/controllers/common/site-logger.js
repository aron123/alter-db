const SQL = require('sql-template-strings');
const db = require('../../utils/database').db;

async function log (user_id, act, original, newContent) {
    await db.run(SQL`INSERT INTO siteLog (user_id, act, original, new) VALUES (${user_id}, ${act}, ${JSON.stringify(original)}, ${JSON.stringify(newContent)})`);
}

module.exports = {
    log
};
