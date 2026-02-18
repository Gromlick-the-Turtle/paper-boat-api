import ReviewController from '#controllers/ReviewController';

export default function ReviewRoutes (router) {
    router.get('/review',          ReviewController.bind('get'));
    router.get('/review/:id',      ReviewController.bind('getOne'));
    router.post('/review',         ReviewController.bind('create'));
    router.post('/review/:id',     ReviewController.bind('update'));
    router.delete('/review/:id',   ReviewController.bind('delete'));
}