import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Review extends Model {
    static table = 't_review';

    static { this.init(); }
}