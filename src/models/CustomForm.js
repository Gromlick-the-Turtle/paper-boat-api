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
        name: String,
        description: String,
        organizationId: Number,
        type: String,
        items: Object
    };

    static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt'
    ];

    static { this.init(); }
}