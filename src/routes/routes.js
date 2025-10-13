import express from 'express';
import _ from 'lodash';

import { getRoles } from '#models/Lookup';
import User from '#models/User';

const routes = express.Router()

routes.get('/', (req, res) => res.json(['hi!']));

routes.get('/roles', async (req, res) => res.json(await getRoles()));

routes.get('/user', async (req, res) => res.json(await User.get()));

routes.post('/user', async (req, res) => {
    const id = await User.create(req.body);
    res.json(id);
});

export default routes;