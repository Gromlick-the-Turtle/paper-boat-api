import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class User extends Model {
    static { this.init(); }

    static table = 't_user';

    static id = Number;
    static nameFirst = String;
    static nameLast = String;
    static email = String;
    static emailVerified = Boolean;
    static isAdmin = Boolean;
    static isReviewer = Boolean;
    static isAuthor = Boolean;
}