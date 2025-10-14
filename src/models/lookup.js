import db from '#config/db';
import Model from '#models/Model';

export default class Lookup extends Model {
    static { this.init(); }

    static id = Number;
    static label = String;

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