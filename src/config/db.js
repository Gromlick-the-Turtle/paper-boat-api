import pgp from 'pg-promise';
import _ from 'lodash';

const db = pgp()({
    host: 'localhost',
    port: 8080,
    user: 'postgres',
    database: 'postgres',
    password: 'password'
});

db.insertObj = async (table, obj) => {
    const cols = _.chain(obj)
        .keys()
        .map(k => `\t\t${k}`)
        .join(',\n')
        .value();

    const params = _.chain(obj)
        .keys()
        .map(k => `\t\t$(${k})`)
        .join(',\n')
        .value();

    const query = `
        INSERT INTO public.${table} (\n${cols}\n\t)
        VALUES (\n${params}\n\t)
        RETURNING *
    `;

    return await db.one(query, obj);
}

export default db;