import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class SubmissionEvent extends Model {
    static tableName = 't_submission_event';

    id = 'number';
    name = 'string';
    description = 'string';
    dueDate = 'string';
    organizationId = 'number';

    // static model () { return {
    //     id: Number,
    //     name: String,
    //     description: String,
    //     dueDate: String,
    //     organizationId: Number,
    // }};
}

// export default class SubmissionEvent extends Model {
//     static table = 't_submission_event';

//     static fields = {
//         id: Number,
//         createdAt: String,
//         updatedAt: String,
//         deletedAt: String,
//         name: String,
//         description: String,
//         dueDate: String,
//         organizationId: Number
//     };

//     static hidden = [
//         'createdAt',
//         'updatedAt',
//         'deletedAt'
//     ];
// }