const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SQL = require('sql-template-strings');
const db = require('../utils/database').db;
const config = require('../config');

function handleError (res) {
    res.status(401).json({
        success: false,
        error: 'Invalid username or password'
    });
}

async function loginUser (req, res) {
    const nick = req.body.nick;
    const password = req.body.password;
    const user = await db.get(SQL`SELECT id, nick, password FROM user WHERE nick=${nick}`);

    if (!user) {
        return handleError(res);
    }

    let passwordMatch;

    try {
        passwordMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
        passwordMatch = false;
    }

    console.log(passwordMatch)

    if (!passwordMatch) {
        return handleError(res);
    }

    const accessToken = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });

    return res.json({ success: true, accessToken });
}

module.exports = {
    loginUser
};
