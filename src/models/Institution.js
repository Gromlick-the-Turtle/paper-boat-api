import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Institution extends Model {
    static table = 't_institution';

    static { this.init(); }
}