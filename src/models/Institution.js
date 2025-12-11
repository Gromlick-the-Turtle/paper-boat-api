import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Institution extends Model {
    static table = 't_institution';

    static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt',
        'snakeName',
    ];

    static fields = {
        id: Number,
        createdAt: String,
        updatedAt: String,
        deletedAt: String,
        name: String,
        snakeName: String,
        description: String,
        addressId: Number,
        organizationId: Number,
    }

    static create (item) {
        item.snakeName = _.snakeCase(item.name);

        return super.create(item)
            .onConflict('snakeName')
            .ignore();
    }

    static getByName (name) {
        return super
            .get({ snakeName: _.snakeCase(name) });
    }

    static { this.init(); }
}