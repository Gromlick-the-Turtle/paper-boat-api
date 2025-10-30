import express from 'express';
import _ from 'lodash';
import fs from 'node:fs';

import AuthController from '#controllers/AuthController';

const routes = express.Router()

const dir = fs.readdirSync('./src/routes');

_.each(dir, async file => {
    file = _.replace(file, '.js', '');

    if (file != 'routes') {
        let route = await import(`#routes/${file}`);
        route.default(routes);
    }
});

routes.post('/login', (...args) => AuthController.login(...args));

export default routes;