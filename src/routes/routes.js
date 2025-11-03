import express from 'express';
import _ from 'lodash';
import fs from 'node:fs';

import AuthController from '#controllers/AuthController';

const authedRoutes = express.Router();
const dir = fs.readdirSync('./src/routes');

_.each(dir, async file => {
    if (file.includes('.js') && file != 'routes.js') {
        file = _.replace(file, '.js', '');

        let route = await import(`#routes/${file}`);
        route.default(authedRoutes);
    }
});

const routes = express.Router();
routes.use('/v1', AuthController.checkAuth, authedRoutes);

routes.post(
    '/auth/register',
    AuthController.register,
    AuthController.newToken,
);

routes.post(
    '/auth/login',
    AuthController.login,
    AuthController.newToken,
);

routes.post(
    '/auth/refresh',
    AuthController.checkAuth,
    AuthController.newToken,
);

export default routes;