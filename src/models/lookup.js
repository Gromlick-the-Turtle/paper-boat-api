import db from '#config/db';

export default class Lookup {
    static async getCountries () {
        return await db('l_country').select('*');
    }

    static async getStates () {
        return await db('l_state').select('*');
    }

    static async getUserRoles () {
        return await db('l_user_role').select('*');
    }

    static async getCustomFormItemTypes () {
        return await db('l_custom_form_item_type').select('*');
    }
}