import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class UserOrganization extends Model {
    static table = 't_user_organization';

    static async getAuthedUser (userId, organizationId) {
        const query = db(this.table).where({ userId });

        if (!_.isNil(organizationId)) {
            query.where({ organizationId });
        }

        return query;
    }

    static { this.init(); }
}