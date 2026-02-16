import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import User from '#models/User';
import SubmissionEvent from '#models/SubmissionEvent';

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

    static joins = {
        authorUser: this.hasOne(User),
        submissionEvent: this.hasOne(SubmissionEvent),
    };

    static { this.init(); }
}