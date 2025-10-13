import _ from 'lodash';

import db from '#config/db';
import ModelAbstract from '#models/ModelAbstract';

export default class User extends ModelAbstract {
    static { this.init(); }

    static id = Number;
    static nameFirst = String;
    static nameLast = String;
    static email = String;
    static emailVerified = Boolean;

    static async get (opts = {}) {
        const users = await db.any("SELECT * FROM public.user");
        return _.map(users, user => new User(user));
    }

    static async create (user) {
        user = new User(user);

        let {id} = await db.insertObj('user', user.forDB());
        return id;
    }
}