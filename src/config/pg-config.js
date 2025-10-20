import knex from 'knex';
import _ from 'lodash';

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 8080,
        user: 'postgres',
        password: 'password',
        database: 'postgres',
    },

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