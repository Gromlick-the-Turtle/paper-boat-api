import knex from 'knex';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Maybe this function should live elsewhere
const camelKeys = function (json) {
    // specific type checks go here
    if (_.isDate (json)) {
        return json
    }

    // check if array first, arrays *are* objects
    if (_.isArray (json)) {
        return _.map(json, row => camelKeys(row));
    }

    if (_.isObject (json)) {
        return _.chain(json)
            .mapKeys((val,key) => _.camelCase(key))
            .mapValues(val => camelKeys(val))
            .value();
    }

    // if we got this far, this should really be a basic type
    return json;
}

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
        return camelKeys(result);
    }
});

export default db;