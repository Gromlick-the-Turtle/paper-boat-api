import express from 'express';

import Lookup from '#models/Lookup';

const router = express.Router();

router.get('', (req,res) => res.json('hi!'));

router.get('/country', async (req,res) => res.json(await Lookup.getCountries()));

router.get('/state', async (req,res) => res.json(await Lookup.getStates()));

router.get('/user_role', async (req,res) => res.json(await Lookup.getUserRoles()));

router.get('/custom_form_item_type', async (req,res) => res.json(await Lookup.getCustomFormItemTypes()));

export default router;