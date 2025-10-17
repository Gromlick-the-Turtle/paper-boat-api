import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Address extends Model {
    static table = 't_address';

    static { this.init(); }
}