import express from 'express';
import { getRoles } from '#models/lookup';

const routes = express.Router()

routes.get('/', (req, res) => res.json(['hi!']));

routes.get('/roles', async (req, res) => res.json(await getRoles()));

export default routes;