import AddressController from '#controllers/AddressController';

export default function AddressRoutes (router) {
    router.get('/address',          AddressController.get);
    router.get('/address/:id',      AddressController.getOne);
    router.post('/address',         AddressController.create);
    router.post('/address/:id',     AddressController.update);
    router.delete('/address/:id',   AddressController.delete);
}