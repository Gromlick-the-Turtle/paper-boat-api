import express from 'express';
import _ from 'lodash';
import fs from 'node:fs';

import AuthMiddleware from '#middleware/AuthMiddleware';
import UserController from '#controllers/UserController';

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
routes.use(
    '/v1',
    AuthMiddleware.checkAuth,
    authedRoutes
);

routes.post(
    '/auth/register',
    AuthMiddleware.register,
);

routes.post(
    '/auth/login',
    AuthMiddleware.login,
    AuthMiddleware.newToken,
);

routes.post(
    '/auth/refresh',
    AuthMiddleware.checkAuth,
    AuthMiddleware.newToken,
);

routes.post(
    'auth/pw-reset',
    UserController.requestPwReset,
);

routes.get(
    'auth/pw-reset/:code',
    UserController.getPwReset,
);

routes.post(
    'auth/pw-reset/:code',
    UserController.doPwReset,
);

export default routes;