import db from '#config/db.dev.config';

const getRoles = async () => await db.prepare('SELECT * FROM role').all();

export { getRoles };