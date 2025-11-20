import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Institution extends Model {
    static table = 't_institution';

    static hidden = [
        'snakeName',
    ];

    static fields = {
        id: Number,
        name: String,
        snakeName: String,
        description: String,
        addressId: Number
    }

    static create (item) {
        item.snakeName = _.snakeCase(item.name);

        return super.create(item)
            .onConflict('snake_name')
            .ignore();
    }

    static async upsertByNameMap (name) {
        let id = (
            db(this.table)
            .select('id')
            .where({ snakeName: _.snakeCase(name) })
        )?.[0]?.id;

        if (!_.isNil(id)) {
            return id;
        }

        return (
            await this.create({ name })
        )?.[0]?.id;
    }

    static { this.init(); }
}