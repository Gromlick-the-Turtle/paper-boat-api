import db from '#config/db';

const getRoles = async () => await db.any('SELECT * FROM role');

export { getRoles };