import CustomFormController from '#controllers/CustomFormController';

export default function CustomFormRoutes (router) {
    router.get('/custom_form',          CustomFormController.get);
    router.get('/custom_form/:id',      CustomFormController.getOne);
    router.post('/custom_form',         CustomFormController.create);
    router.post('/custom_form/:id',     CustomFormController.update);
    router.delete('/custom_form/:id',   CustomFormController.delete);
}