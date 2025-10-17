import db from '#config/db';

export default class Lookup {
    static async getCountries () {
        return await db.any('SELECT * FROM l_country');
    }

    static async getStates () {
        return await db.any('SELECT * FROM l_state');
    }

    static async getUserRoles () {
        return await db.any('SELECT * FROM l_user_role');
    }

    static async getCustomFormItemTypes () {
        return await db.any('SELECT * FROM l_custom_form_item_type');
    }
}