import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import UnauthorizedError from '#errors/UnauthorizedError';
import User from '#models/User';

export default class AuthController {
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

        req.authedUser = { id, email: user.email };

        next();
    }

    static async login (req, res, next) {
        const { email, password } = req.body;

        const { id, hash } = (await User.getAuth(email))[0] ?? {};

        if (!id) {
            throw new UnauthorizedError('incorrect email or password')
        }

        const re = await bcrypt.compare(password, hash);

        if (re) {
            req.authedUser = { id, email };
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

        let data;

        try {
            data = await jwt.verify(token, process.env.JWT_SECRET);
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