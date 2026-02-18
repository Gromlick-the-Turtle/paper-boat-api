import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class UserOrganization extends Model {
    static table = 't_user_organization';

    static fields = {
        id: Number,
        createdAt: String,
        updatedAt: String,
        deletedAt: String,
        userId: Number,
        organizationId: Number,
        isAdmin: Boolean,
        isReviewer: Boolean,
        isAuthor: Boolean,
    }

   static hidden = [
        'createdAt',
        'updatedAt',
        'deletedAt',
    ];

    static async getAuthedUser (userId, organizationId) {
        const query = db(this.table).where({ userId });

        if (!_.isNil(organizationId)) {
            query.where({ organizationId });
        }

        return query;
    }
}