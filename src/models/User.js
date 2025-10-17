import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class User extends Model {
    static table = 't_user';

    static hidden = [
        'password'
    ];

    static { this.init(); }
}