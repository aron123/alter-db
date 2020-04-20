const sqlite = require('sqlite');

let db = null;

async function connect () {
    try {
        if (db !== null) {
            return db;
        }

        db = await sqlite.open('./backend/database/autocheck_v2.db', { Promise });
        await db.run('CREATE TABLE IF NOT EXISTS torrent (id INT PRIMARY KEY, data TEXT NOT NULL);');
        await db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT, password TEXT);');
        console.log('Database connection is opened.');
        return db;
    } catch (err) {
        console.error('Database connection is failed:', err);
        return;
    }
};

module.exports = {
    db,
    connect
};
