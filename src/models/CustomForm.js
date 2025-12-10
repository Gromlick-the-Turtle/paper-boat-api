import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class CustomForm extends Model {
    static table = 't_custom_form';

    static fields = {
        id: Number,
        createdAt: String,
        updatedAt: String,
        deletedAt: String,
        type: String,
        items: String,
        submissionEventId: Number
    };

    static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt'
    ];

    static { this.init(); }
}