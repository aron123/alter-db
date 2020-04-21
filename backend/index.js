const config = require('./config');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const db = require('./utils/database');
const jwt = require('./utils/jwtUtils');
const history = require('connect-history-api-fallback');

if (process.env.NODE_ENV === 'production') {
    app.use(history({}));
}

(async () => {
    const connection = await db.connect();
    db.db = connection;

    app.use(bodyParser.json());

    const apiRouter = express.Router();
    
    apiRouter.use(jwt.checkJwt);
    apiRouter.use(jwt.handleAuthenticationError);
    apiRouter.use('/user', require('./routes/user'));
    apiRouter.use('/band', require('./routes/band'));
    apiRouter.use('/site-log', require('./routes/site-log'));

    app.use('/api', apiRouter);

    app.use(express.static('dist/alter-db'));

    app.listen(config.port, (err) => {
        if (err) {
            return console.error(err);
        }

        console.log(`Server listening in ${config.port} ...`);
    });

})();
