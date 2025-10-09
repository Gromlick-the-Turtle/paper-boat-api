import _ from 'lodash';

import db from '#config/db';
import ModelAbstract from '#models/ModelAbstract';

export default class User extends ModelAbstract {
    static id = Number;
    static nameFirst = String;
    static nameLast = String;
    static email = String;
    static butt = String;

    static { this.init(); }

    static async get (opts = {}) {
        const users = await db.any("SELECT * FROM public.user");
        return _.map(users, user => new User(user));
    }
}