import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class Institution extends Model {
    static table = 't_institution';

    static get model () { return {
        id: Number,
        name: String,
        snakeName: String,
        description: String,
        addressId: Number,
        organizationId: Number,
    }}

    static async insert (item) {
        item.snakeName = _.snakeCase(item.name);

        const [re] = await super.insert(item)
            .onConflict('snakeName')
            .ignore();

        return re;
    }

    static async selectByName (name) {
        const [re] = await this.selectWhere({ snakeName: _.snakeCase(name) });

        return re;
    }
}