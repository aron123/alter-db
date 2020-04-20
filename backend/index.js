const config = require('./config');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const db = require('./utils/database');
const jwt = require('./utils/jwtUtils');

(async () => {
    const connection = await db.connect();
    db.db = connection;

    app.use(bodyParser.json());
    app.use(jwt.checkJwt);
    app.use(jwt.handleAuthenticationError);

    const apiRouter = express.Router();

    apiRouter.use('user', require('./routes/user'))

    app.use('/api', apiRouter);

    app.listen(config.port, (err) => {
        if (err) {
            return console.error(err);
        }

        console.log(`Server listening in ${config.port} ...`);
    });

})();
