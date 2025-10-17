import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Organization extends Model {
    static table = 't_organization';

    static { this.init(); }
}