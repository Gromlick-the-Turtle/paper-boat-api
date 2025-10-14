import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class User extends Model {
    static { this.init(); }

    static #table = 't_user';

    static id = Number;
    static nameFirst = String;
    static nameLast = String;
    static email = String;
    static emailVerified = Boolean;
    static isAdmin = Boolean;
    static isReviewer = Boolean;
    static isAuthor = Boolean;

    static async get (opts = {}) {
        const users = await db.selectArr(this.#table);
        return _.map(users, user => new User(user));
    }

    static async create (user) {
        user = new User(user);

        let {id} = await db.insertObj(this.#table, user.forDB());
        return id;
    }
}