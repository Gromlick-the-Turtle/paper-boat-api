import _ from 'lodash';
import bcrypt from 'bcryptjs';

import db from '#config/pg-config';
import Controller from '#controllers/Controller';

import ForbiddenError from '#errors/ForbiddenError';
import ServerError from '#errors/ServerError';

import User from '#models/User';
import UserOrganization from '#models/UserOrganization';
import Institution from '#models/Institution';

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
            user.email = _.toLower(user.email);

            if (_.isEmpty(user.email)) {
                return;
            }

            db.transaction(async trx => {
                let qry = await User
                    .get({ email: user.email })
                    .transacting(trx);

                if (!qry.length) {
                    qry = await User
                        .create(user)
                        .transacting(trx);

                    if (!qry.length) {
                        throw new ServerError('Could not create user');
                    }
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

                if (!_.isEmpty(user.institution) && _.isNil(user.institutionId)) {
                    let institutionId = (
                        await Institution
                        .getByName(user.institution)
                        .transacting(trx)
                    )?.[0]?.id;

                    if (_.isNil(institutionId)) {
                        institutionId = (
                            await Institution
                            .create({ name: user.institution })
                            .transacting(trx)
                        )?.[0]?.id;
                    }

                    if (!_.isNil(institutionId)) {
                        await User
                        .update({ institutionId }, { id: user.userId })
                        .transacting(trx);
                    }
                }
            });
        });

        await Promise.all(proms);

        res.json(_.map(users, ({ email }) => email));
    }

    static async requestPwReset (req, res) {
        const code = await User.requestPwReset(req.body.email);

        res.status(201).json();
    }

    static async getPwReset (req, res) {
        const { nameFirst, nameLast } = await User.getPwReset(req.params.code);

        res.json({ nameFirst, nameLast });
    }

    static async doPwReset (req, res) {
        const password = await bcrypt.hash(req.body.password, 10);

        const re = await User.doPwReset(req.params.code, password);

        if (re) {
            res.status(201).json();
        } else {
            throw new ForbiddenError('Reset failed, try a new request');
        }
    }

    static { this.init(); }
}