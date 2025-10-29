import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import Address from '#models/Address';

export default class Institution extends Model {
    static table = 't_institution';

    static joins = {
        address: this.hasOne(Address)
    }

    static { this.init(); }
}