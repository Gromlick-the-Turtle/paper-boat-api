import express from 'express';
import _ from 'lodash';
import fs from 'node:fs';

import lookupRoutes from '#routes/lookupRoutes';
import UserRoutes from '#routes/UserRoutes';
import InstitutionRoutes from '#routes/InstitutionRoutes';

const routes = express.Router()

const dir = fs.readdirSync('./src/routes');

_.each(dir, async file => {
    file = _.replace(file, '.js', '');

    if (file != 'routes') {
        let route = await import(`#routes/${file}`);
        route.default(routes);
    }
});

export default routes;