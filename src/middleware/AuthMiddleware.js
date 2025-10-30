import jwt from 'jsonwebtoken';

export default authMiddleware (req, res, next) {
    const token = _.chain(req.headers['authorization'])
        ?.split(' ')
        ?.nth(1)
        ?.value();

    if (!token) {
        return res.status(403).json({ error: 'Auth Error: No token provided' });
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET);
}