const sqlite = require('sqlite');

let db = null;

async function connect () {
    try {
        if (db !== null) {
            return db;
        }

        db = await sqlite.open('./backend/database/alter_db_v2.db', { Promise });
        await db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT UNIQUE, password TEXT);');
        await db.run('CREATE TABLE IF NOT EXISTS band (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, foundation_year NUMBER, members TEXT, description TEXT);');
        await db.run('CREATE TABLE IF NOT EXISTS image (id INTEGER PRIMARY KEY AUTOINCREMENT, band_id INTEGER, url TEXT, thumbnail_url TEXT, FOREIGN KEY(band_id) REFERENCES band(id));')
        await db.run('CREATE TABLE IF NOT EXISTS siteLog (id INTEGER PRIMARY KEY AUTOINCREMENT, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, act TEXT, original TEXT, new TEXT, FOREIGN KEY(user_id) REFERENCES user(id));');
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
