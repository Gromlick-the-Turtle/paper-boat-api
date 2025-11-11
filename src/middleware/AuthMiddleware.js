import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import UnauthorizedError from '#errors/UnauthorizedError';
import User from '#models/User';
import UserOrganization from '#models/UserOrganization';

export default class AuthMiddlewas {
    static async register (req, res, next) {
        const user = req.body;

        if (!user.email) {
            throw Error('User must have email');
        }

        if (!user.password) {
            throw Error('User must have password');
        }

        user.password = await bcrypt.hash(user.password, 10);

        const id = (await User.create(user))[0].id;

        req.authedUser = (await UserOrganization.getAuthedUser(id))[0] ?? { userId: id };

        res.status(201).json(true);
    }

    static async login (req, res, next) {
        const { email, password } = req.body;

        const { id, hash } = (await User.getAuth(email))[0] ?? {};

        if (!id) {
            throw new UnauthorizedError('incorrect email or password')
        }

        const re = await bcrypt.compare(password, hash);

        if (re) {
            req.authedUser = (await UserOrganization.getAuthedUser(id))[0] ?? { userId: id };
        } else {
            throw new UnauthorizedError('incorrect email or password')
        }

        next();
    }

    static async checkAuth (req, res, next) {
        const token = _.chain(req.headers['authorization'])
            ?.split(' ')
            ?.nth(1)
            ?.value();

        if (!token) {
            throw new UnauthorizedError('no token provided');
        }

        try {
            const { userId } = await jwt.verify(token, process.env.JWT_SECRET);

            req.authedUser = (await UserOrganization.getAuthedUser(userId))[0];
        } catch (e) {
            throw new UnauthorizedError('token is expired or malformed')
        }

        next();
    }

    static async newToken (req, res, next) {
        if (!req.authedUser) {
            throw new UnauthorizedError('no user authed');
        }

        const token = jwt.sign(
            req.authedUser,
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ token });
    }
}