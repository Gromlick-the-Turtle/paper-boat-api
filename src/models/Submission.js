import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Submission extends Model {
    static table = 't_submission';

    static { this.init(); }
}