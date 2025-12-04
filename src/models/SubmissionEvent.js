import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class SubmissionEvent extends Model {
    static table = 't_submission_event';

    static fields = {
        id: Number,
        createdAt: String,
        updatedAt: String,
        deletedAt: String,
        name: String,
        description: String,
        dueDate: String,
        organizationId: Number,
        submissionFormId: Number,
        reviewFormId: Number
    };

    static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt'
    ];

    static { this.init(); }
}