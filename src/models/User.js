import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import Institution from '#models/Institution';
import UserOrganization from '#models/UserOrganization';

export default class User extends Model {
    static table = 't_user';

    static hidden = [
        'password'
    ];

    static joins = {
        institution: this.hasOne(Institution),
        // roles: this.hasMany(UserOrganization),
        // role: this.hasOne(UserOrganization, 'userId', 'id'),
        role: query => {
            query
                .leftJoin(
                    UserOrganization.table,
                    `${UserOrganization.table}.userId`,
                    `${this.table}.id`,
                )
                .select(
                    `${UserOrganization.table}.id AS organizationId`,
                    `${UserOrganization.table}.isAuthor`,
                    `${UserOrganization.table}.isReviewer`,
                    `${UserOrganization.table}.isAdmin`,
                );
        }
    };

    static getAuth (email) {
        return db(this.table)
            .select('id', 'password AS hash')
            .where({ email });
    }

    static getProfile (id) {
        const q = this
            .get({ id })
            .leftJoin(
                db
                    .select(
                        'userId',
                        db.raw(`JSONB_AGG(r) AS roles`)
                    )
                    .from(db.raw(`(SELECT 1) AS o`))
                    .crossJoin(`${UserOrganization.table} AS r`)
                    .groupBy('userId')
                    .as('r'),
                `r.userId`,
                `${this.table}.id`,
            )
            .select('r.roles');

        return q;
    }

    static { this.init(); }
}