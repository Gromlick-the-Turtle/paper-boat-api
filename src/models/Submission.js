import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Submission extends Model {
    static table = 't_submission';

    static fields = {
        id: Number,
        createdAt: String,
        updatedAt: String,
        deletedAt: String,
        title: String,
        authorUserId: Number,
        submissionEventId: Number
    };

    static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt'
    ];

    static { this.init(); }
}