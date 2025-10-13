import db from '#config/db';
import ModelAbstract from '#models/ModelAbstract';

export default class Lookup extends ModelAbstract {
    static { this.init(); }

    static id = Number;
    static label = String;

    static async getRoles () {
        return await db.any('SELECT * FROM l_user_role');
    }
}