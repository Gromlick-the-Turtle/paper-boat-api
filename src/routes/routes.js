import express from 'express';
import _ from 'lodash';
import fs from 'node:fs';

import AuthController from '#controllers/AuthController';
// import authMiddleware from '#middleware/AuthMiddleware';

const routes = express.Router()

const dir = fs.readdirSync('./src/routes');

_.each(dir, async file => {
    file = _.replace(file, '.js', '');

    if (file != 'routes') {
        let route = await import(`#routes/${file}`);
        route.default(routes, [AuthController.checkAuth]);
    }
});

routes.post('/auth/register', (...args) => AuthController.register(...args));
routes.post('/auth/login', (...args) => AuthController.login(...args));

export default routes;