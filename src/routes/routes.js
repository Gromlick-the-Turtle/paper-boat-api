import express from 'express';
import _ from 'lodash';

import lookupRoutes from '#routes/lookupRoutes';
import userRoutes from '#routes/userRoutes';

const routes = express.Router()

routes.use('/lookup', lookupRoutes);
routes.use('/user', userRoutes);

export default routes;