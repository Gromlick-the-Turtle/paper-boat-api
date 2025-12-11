import InstitutionController from '#controllers/InstitutionController';

export default function InstitutionRoutes (router) {
    router.get('/institution',          InstitutionController.bind('get'));
    router.get('/institution/:id',      InstitutionController.bind('getOne'));
    router.post('/institution',         InstitutionController.bind('create'));
    router.post('/institution/:id',     InstitutionController.bind('update'));
    router.delete('/institution/:id',   InstitutionController.bind('delete'));
}