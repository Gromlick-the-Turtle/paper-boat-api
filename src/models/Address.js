import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class address extends Model {
    static table = 't_address';

    static fields = {
        id: Number,
        line1: String,
        line2: String,
        stateId: Number,
        countryId: Number,
        zip: String
    }

    static { this.init(); }
}