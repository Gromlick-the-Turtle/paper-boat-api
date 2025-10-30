import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '#models/User';

export default class AuthController {
    static async register (req, res) {
        const user = req.body;

        if (!user.email) {
            throw Error('User must have email');
        }

        if (!user.password) {
            throw Error('User must have password');
        }

        user.password = await bcrypt.hash(user.password, 10);

        const id = (await User.create(user))[0].id;

        res.json(id);
    }

    static async login (req, res) {
        const { email, password } = req.body;

        const { id, hash } = (await User.getAuth(email))[0];

        if (!id) {
            res.status(403).json({ error: 'incorrect email or password' });
        }

        const re = await bcrypt.compare(password, hash);

        if (re) {
            const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '15m' });
            res.json({ token });
        } else {
            res.status(403).json({ error: 'incorrect email or password' });
        }
    }
}