import express from 'express';

import User from '#models/User';

const router = express.Router();

router.get('', async (req, res) => {
    res.json(await User.get(req.query));
});

router.post('', async (req, res) => {
    res.json(await User.create({ ...req.body, password: 'x' }));
});

router.post('/:id', async (req, res) => {
    res.json(await User.update(req.body, { id: req.params.id }));
});

router.delete('/:id', async (req, res) => {
    await User.delete({ id: req.params.id });
    res.json();
});

export default router;