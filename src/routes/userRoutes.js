import UserController from '#controllers/UserController';

export default function UserRoutes (router) {
    router.get('/user',         UserController.bind('get'));
    router.get('/user/:id',     UserController.bind('getOne'));
    router.post('/user',        UserController.bind('inviteUser'));
    router.post('/user/:id',    UserController.bind('update'));
    router.delete('/user/:id',  UserController.bind('delete'));

    router.get('/profile',      UserController.bind('getProfile'));
}