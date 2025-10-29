import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import Institution from '#models/Institution';

export default class User extends Model {
    static table = 't_user';

    static hidden = [
        'password'
    ];

    static joins = {
        institution: this.hasOne(Institution),
    };

    static { this.init(); }
}