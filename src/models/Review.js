import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import ModelList from '#models/ModelList';

import User from '#models/User';
// import { Submission } from '#models/Submission';
// import SubmissionEvent from '#models/SubmissionEvent';

export default class Review extends Model {
    static tableName = 't_review';

    id = 'number';
    reviewerUserId = 'number';
    submissionId = 'number';
    content = 'object';

    // static model () { return {
    //     id: Number,
    //     reviewerUserId: Number,
    //     submissionId: Number,
    //     content: Object,

    //     submission: Submission,
    // }}
}

// export class ReviewList extends ModelList {
//     static model () { return _Review; }
// }

// export default class Review extends Model {
//     static table = 't_review';

//     static fields = {
//         id: Number,
//         createdAt: String,
//         updatedAt: String,
//         deletedAt: String,
//         reviewerUserId: Number,
//         submissionId: Number,
//         content: Object,
//     };

//     static hidden = [
//         'createdAt',
//         'updatedAt',
//         'deletedAt'
//     ];

//     static joins = {
//         reviewerUser: this.hasOne(User),
//         // submission: this.hasOne(Submission),

//         // organizationId: query => {
//         //     query
//         //         .leftJoin(
//         //             Submission.table,
//         //             `${Submission.table}.id`,
//         //             `${Review.table}.submissionId`
//         //         )
//         //         .leftJoin(
//         //             SubmissionEvent.table,
//         //             `${SubmissionEvent.table}.id`,
//         //             `${Submission.table}.submissionEventId`
//         //         )
//         //         .select('organizationId');
//         // }
//     }
// }