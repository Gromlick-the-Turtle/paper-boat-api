import _ from 'lodash';
import db from '#config/db';

export default class User {
    id;
    name_first;
    name_last;
    email;

    constructor (user) {
        Object.assign(this, _.pick(user, _.keys(this)));
    }

    static async get (opts = {}) {
        const users = await db.any("SELECT * FROM public.user");
        return _.map(users, user => new User(user));
    }

    // static create async () {

    // }
}