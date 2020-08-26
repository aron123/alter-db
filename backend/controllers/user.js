const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid').v4;
const fetch = require('node-fetch');

const SQL = require('sql-template-strings');
const db = require('../utils/database').db;

const config = require('../config');
const email = require('../utils/email');
const serverErrorHandler = require('./common/error-handler');

function handleError(res) {
    res.status(401).json({
        success: false,
        error: 'Invalid username or password'
    });
}

function isEmailValid(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

async function isCaptchaSolved(token) {
    try {
        const params = new URLSearchParams();
        params.append('secret', config.reCaptchaSecretKey);
        params.append('response', token);

        const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            body: params
        });
        const data = await res.json();
        return data.success;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function hashPassword (password) {
    return bcrypt.hash(String(password), config.bcryptSaltRounds)
}

async function createUser(req, res) {
    if (!req.body.nick || !req.body.password || !req.body.email) {
        return res.status(400).json({
            success: false,
            error: 'Nickname, email and password must be provided.'
        });
    }

    if (!isEmailValid(req.body.email)) {
        return res.status(400).json({
            success: false,
            error: 'Email address is not valid.'
        });
    }

    const captchaSolved = await isCaptchaSolved(req.body.grecaptcha);

    if (!captchaSolved) {
        return res.status(400).json({
            success: false,
            error: 'Captcha is not solved.'
        });
    }

    let passwordHash;

    try {
        passwordHash = await hashPassword(req.body.password);
    } catch (err) {
        console.error(err);
        return serverErrorHandler.handleError(res);
    }

    let user;

    try {
        user = {
            nick: req.body.nick,
            email: req.body.email,
            password: passwordHash,
            emailActivationId: uuidv4()
        }
        await db.run(SQL`INSERT INTO user (nick, email, password, email_activation_id) VALUES (${user.nick}, ${user.email}, ${user.password}, ${user.emailActivationId});`);
    } catch (err) {
        if (err.errno === 19) {
            return res.status(400).json({
                success: false,
                error: 'This nickname or email address is already registered. Please choose another one.'
            });
        }

        console.error(err);
        return serverErrorHandler.handleError(res);
    }

    try {
        await email.sendActivationEmail(user.nick, user.email, user.emailActivationId);
    } catch (err) {
        console.error(err);
    }

    res.json({
        success: true
    });
}

async function activateUser(req, res) {
    const key = req.params.key;

    if (!key) {
        return res.status(400).json({
            success: false,
            error: 'There is no activation key.'
        });
    }

    try {
        const user = await db.get(SQL`SELECT id, activated FROM user WHERE email_activation_id=${key}`);

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Activation code is invalid.'
            })
        }

        if (user.activated) {
            return res.status(400).json({
                success: false,
                error: 'The user is already activated.'
            })
        }

        await db.run(SQL`UPDATE user set activated=1 WHERE id=${user.id}`);
        res.json({
            success: true
        });
    } catch (err) {
        console.error(err);
        serverErrorHandler.handleError(res);
    }
}

async function loginUser(req, res) {
    const nick = req.body.nick;
    const password = req.body.password;
    let user;

    try {
        user = await db.get(SQL`SELECT id, nick, password FROM user WHERE nick=${nick} AND activated=1`);
    } catch (err) {
        console.error(err);
        return serverErrorHandler.handleError(res);
    }

    if (!user) {
        return handleError(res);
    }

    let passwordMatch;

    try {
        passwordMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
        passwordMatch = false;
    }

    if (!passwordMatch) {
        return handleError(res);
    }

    const accessToken = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });

    return res.json({ success: true, accessToken });
}

async function getUser(req, res) {
    const userId = req.user.id;

    try {
        const data = await db.get(SQL`SELECT id, nick, email FROM user WHERE id=${userId} AND activated=1`);

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'The user is not exists.'
            });
        }

        res.json({
            success: true,
            data
        });
    } catch (err) {
        console.error(err);
        return serverErrorHandler.handleError(res);
    }
}

async function changePassword (req, res) {
    const password = req.body.password;
    const userId = req.user.id;

    if (!password) {
        return res.status(400).json({
            success: false,
            error: 'A new password must be provided.'
        });
    }

    try {
        const passwordHash = await hashPassword(String(password));
        await db.run(SQL`UPDATE user SET password=${passwordHash} WHERE id=${userId}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        return serverErrorHandler.handleError(res);
    }
}

module.exports = {
    loginUser,
    createUser,
    activateUser,
    getUser,
    changePassword
};
