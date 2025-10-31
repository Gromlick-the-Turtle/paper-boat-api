import knex from 'knex';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' })

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },

    wrapIdentifier: (val, origImp, ctx) => origImp(_.snakeCase(val)),

    postProcessResponse: (result, ctx) => {
        if (_.isArray(result)) {
            return _.map(
                result,
                row => _.mapKeys(
                    row,
                    (val,key) => _.camelCase(key)
                )
            );
        } else {
            return _.mapKeys((val,key) => _.camelCase(key));
        }
    }
});

export default db;