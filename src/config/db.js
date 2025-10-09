import pgp from 'pg-promise';

const db = pgp()({
    host: 'localhost',
    port: 8080,
    user: 'postgres',
    database: 'postgres',
    password: 'password'
});

export default db;