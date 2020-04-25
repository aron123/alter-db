const jwt = require('express-jwt');
const config = require('../config');

const checkJwt = jwt({
    secret: config.jwtSecret,
    credentialsRequired: true
}).unless({
    path: [
        /^\/api\/user\/register/,
        /^\/api\/user\/activate/,
        /^\/api\/user\/login/
    ]
});

function handleAuthenticationError(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            error: 'Auth is failed.'
        });
    }

    next();
}

module.exports = {
    checkJwt,
    handleAuthenticationError
};
