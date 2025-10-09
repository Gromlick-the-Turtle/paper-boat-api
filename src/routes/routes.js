import express from 'express';
import { getRoles } from '#models/Lookup';
import User from '#models/User';

const routes = express.Router()

routes.get('/', (req, res) => res.json(['hi!']));

routes.get('/roles', async (req, res) => res.json(await getRoles()));

routes.get('/user', async (req, res) => res.json(await User.get()));

export default routes;