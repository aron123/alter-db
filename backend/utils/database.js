const sqlite = require('sqlite');

let db = null;

async function connect () {
    try {
        if (db !== null) {
            return db;
        }

        db = await sqlite.open('./backend/database/alter_db.db', { Promise });
        await db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT, password TEXT);');
        await db.run('CREATE TABLE IF NOT EXISTS bands (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, foundation_year NUMBER, members TEXT, description TEXT);');
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
