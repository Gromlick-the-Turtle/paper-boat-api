import InstitutionController from '#controllers/InstitutionController';

export default function InstitutionRoutes (router) {
    router.get('/institution',          InstitutionController.get);
    router.get('/institution/:id',      InstitutionController.getOne);
    router.post('/institution',         InstitutionController.create);
    router.post('/institution/:id',     InstitutionController.update);
    router.delete('/institution/:id',   InstitutionController.delete);
}