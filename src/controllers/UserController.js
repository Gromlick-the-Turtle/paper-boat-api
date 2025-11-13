import _ from 'lodash';

import db from '#config/pg-config';
import Controller from '#controllers/Controller';

import ForbiddenError from '#errors/ForbiddenError';
import ServerError from '#errors/ServerError';

import User from '#models/User';
import UserOrganization from '#models/UserOrganization';

export default class UserController extends Controller {
    static model = User;

    static withOrganization;

    static async getProfile (req, res) {
        res.json((await User.getProfile(req.authedUser.userId))[0]);
    }

    static async inviteUser (req, res) {
        if (!req.authedUser.isAdmin) {
            throw new ForbiddenError('Only admins can invite users');
        }

        const users = _.isArray(req.body) ? req.body : [req.body];

        const proms = _.map(users, async user => {
            user.password = 'temp';
            user.organizationId = req.authedUser.organizationId;

            db.transaction(async trx => {
                let qry = await User
                    .get({ email: user.email })
                    .transacting(trx);

                if (!qry.length) {
                    qry = await User
                        .create(user)
                        .transacting(trx);
                }

                if (!qry.length) {
                    throw new ServerError('Could not create user');
                }

                user.userId = qry[0].id;

                qry = await UserOrganization
                    .get({
                        userId: user.userId,
                        organizationId: user.organizationId
                    })
                    .transacting(trx);

                if (qry.length) {
                    let userOrg = qry[0];

                    await UserOrganization
                        .update({
                            ...userOrg,
                            ...user,
                        }, { id: userOrg.id })
                        .transacting(trx);
                } else {
                    await UserOrganization
                        .create(user)
                        .transacting(trx);
                }
            });
        });

        await Promise.all(proms);

        res.json(_.map(users, ({ email }) => email));
    }

    static { this.init(); }
}