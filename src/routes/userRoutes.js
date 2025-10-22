import UserController from '#controllers/UserController';

export default function UserRoutes (router) {
    router.get('/user',         UserController.get);
    router.get('/user/:id',     UserController.getOne);
    router.post('/user',        UserController.create);
    router.post('/user/:id',    UserController.update);
    router.delete('/user/:id',  UserController.delete);
}