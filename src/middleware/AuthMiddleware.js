import jwt from 'jsonwebtoken';
import _ from 'lodash';

export default async function authMiddleware (req, res, next) {
    const token = _.chain(req.headers['authorization'])
        ?.split(' ')
        ?.nth(1)
        ?.value();

    if (!token) {
        return res.status(403).json({ error: 'Auth Error: No token provided' });
    }

    let data;

    try {
        data = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        res.status(401).json({ error: 'Auth Error: token is expired or malformed' });
    }

    next();
}