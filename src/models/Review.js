import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

import User from '#models/User';
import Submission from '#models/Submission';
import SubmissionEvent from '#models/SubmissionEvent';

export default class Review extends Model {
    static table = 't_review';

    static fields = {
        id: Number,
        createdAt: String,
        updatedAt: String,
        deletedAt: String,
        reviewerUserId: Number,
        submissionId: Number,
        content: Object,
    };

    static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt'
    ];

    static joins = {
        reviewerUser: this.hasOne(User),
        submission: this.hasOne(Submission),

        organizationId: query => {
            query
                .leftJoin(
                    Submission.table,
                    `${Submission.table}.id`,
                    `${Review.table}.submissionId`
                )
                .leftJoin(
                    SubmissionEvent.table,
                    `${SubmissionEvent.table}.id`,
                    `${Submission.table}.submissionEventId`
                )
                .select('organizationId');
        }
    }
}