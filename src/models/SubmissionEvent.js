import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class SubmissionEvent extends Model {
    static table = 't_submission_event';

    static { this.init(); }
}