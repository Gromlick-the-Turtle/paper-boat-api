import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import ModelList from '#models/ModelList';

import User from '#models/User';
import Review from '#models/Review';
import SubmissionEvent from '#models/SubmissionEvent';

export class Submission extends Model {
    static tableName = 't_submission';

    id = 'number';
    title = 'string';
    authorUserId = 'number';
    submissionEventId = 'number';
    content = 'object';
}

export class SubmissionDetail extends Submission {
    submissionEvent = function object (query) {
        SubmissionEvent.joinOne(query);
    }

    reviews = function object (query) {
        Review.joinMany(query, 'submissionId');
    }

    organizationId = function number (query) {
        query.select('organizationId');
    }
}

console.log(
    // await SubmissionEvent.forJoin(),
    await SubmissionDetail.selectOne(16),
    // await q1.crossJoin(q2.as('thing')).select('*')
    )

// export default class Submission extends Model {
//     static table = 't_submission';

//     static fields = {
//         id: Number,
//         createdAt: String,
//         updatedAt: String,
//         deletedAt: String,
//         title: String,
//         authorUserId: Number,
//         submissionEventId: Number,
//         content: Object,
//     };

//     static hidden = [
//         'createdAt',
//         'updatedAt',
//         'deletedAt'
//     ];

//     static joins = {
//         authorUser: this.hasOne(User),
//         submissionEvent: this.hasOne(SubmissionEvent),

//         organizationId: query => {
//             query
//                 .leftJoin(
//                     SubmissionEvent.table,
//                     `${SubmissionEvent.table}.id`,
//                     `${Submission.table}.submissionEventId`
//                 )
//                 .select('organizationId');
//         },
//     };
// }