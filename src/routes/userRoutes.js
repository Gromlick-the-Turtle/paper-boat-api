import express from 'express';

import UserController from '#controllers/UserController';

const router = express.Router();

router.get('',          UserController.get);
router.get('/:id',      UserController.getOne);
router.post('',         UserController.create);
router.post('/:id',     UserController.update);
router.delete('/:id',   UserController.delete);

export default router;