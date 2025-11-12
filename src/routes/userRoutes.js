import UserController from '#controllers/UserController';

export default function UserRoutes (router) {
    router.get('/user',         UserController.get);
    router.get('/user/:id',     UserController.getOne);
    router.post('/user',        UserController.inviteUser);
    router.post('/user/:id',    UserController.update);
    router.delete('/user/:id',  UserController.delete);

    router.get('/profile',      UserController.getProfile);
}