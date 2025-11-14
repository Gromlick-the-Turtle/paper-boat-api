import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';
import Institution from '#models/Institution';
import UserOrganization from '#models/UserOrganization';

function generateUID() {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

export default class User extends Model {
    static table = 't_user';

    static fields = {
        id: Number,
        nameFirst: String,
        nameLast: String,
        email: String,
        emailVerified: Boolean,
        password: String,
        institutionId: Number,
        bio: String,
    };

    static hidden = [
        'password',
        // 'roles',
    ];

    static joins = {
        institution: this.hasOne(Institution),
        roles: this.hasMany(UserOrganization),
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

    static async requestPwReset (email) {
        const id = (
            await db(this.table)
            .select('id')
            .where({ email })
        )?.[0]?.id;

        if (!id) { return; }

        await db('user_password_reset')
            .update({ cancelledAt: 'NOW()' })
            .where({ userEmail: email })
            .whereNull('doneAt')
            .whereNull('cancelledAt');

        return (await db('user_password_reset')
            .insert({
                userEmail: email,
                userId: id,
                code: generateUID(),
            })
            .returning('code'))[0];
    }

    static async getPwReset (code) {
        return (
            await db('user_password_reset')
            .select('nameFirst', 'nameLast')
            .join(this.table, `${this.table}.id`, 'user_password_reset.userId')
            .where({ code })
            .whereNull('doneAt')
            .whereNull('cancelledAt')
        )[0];
    }

    static async doPwReset (code, password) {
        const userId = (
            await db('user_password_reset')
            .update({ doneAt: 'NOW()' })
            .where({ code })
            .whereNull('doneAt')
            .whereNull('cancelledAt')
            .returning('userId')
        )[0].userId;

        if (userId) {
            await db(this.table)
                .update({ password })
                .where({ id: userId });

            return true;
        } else {
            return false;
        }
    }

    static getProfile (id) {
        return db
            .select(
                ..._.map(this.keys(), key => `${this.table}.${key}`),
                'r.roles',
            )
            .from(User.table)
            .leftJoin(
                db
                    .select(
                        'userId',
                        db.raw(`JSONB_AGG(r) AS roles`)
                    )
                    .from(db.raw(`(SELECT 1) AS o`))
                    .crossJoin(UserOrganization.get().as('r'))
                    .groupBy('userId')
                    .as('r'),
                `r.userId`,
                `${this.table}.id`,
            )
            .where({ [`${User.table}.id`]: id });
    }

    static { this.init(); }
}