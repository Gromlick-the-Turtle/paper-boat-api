import knex from 'knex';
import fs from 'node:fs';
import _ from 'lodash';

const filename = './dev-db.sqlite';

if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, '');
}

const db = knex({
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,

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