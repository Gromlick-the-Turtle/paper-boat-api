import Lookup from '#models/Lookup';

export default function (router) {
    router.get('/lookup', (req,res) => res.json('hi!'));

    router.get('/lookup/country', async (req,res) => res.json(await Lookup.getCountries()));

    router.get('/lookup/state', async (req,res) => res.json(await Lookup.getStates()));

    router.get('/lookup/user_role', async (req,res) => res.json(await Lookup.getUserRoles()));

    router.get('/lookup/custom_form_item_type', async (req,res) => res.json(await Lookup.getCustomFormItemTypes()));
}