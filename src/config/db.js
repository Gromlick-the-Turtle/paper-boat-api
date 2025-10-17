import _ from 'lodash';

import db from '#config/pg-config';

const paramsFromObj = (obj) => {
    const cols = _.keys(obj);
    
    const params = _.map(cols, c => `$(${c})`);

    return { cols, params };
}

const paramsFromArr = (arr) => {
    const cols = _.keys(arr[0]);

    const objs = _.mapKeys(arr, (val,key) => `obj${key}`);

    const params = _.map(objs, (obj,key) => {
        return '(' + 
            _.chain(cols)
            .map(col => `$(${key}.${col})`)
            .join(', ')
            .value() +
        ')';
    });

    return { cols, params, objs };
}

db.tableSchema = 'public';

db.getTableColumns = (table) => {
    return db.any(`
        SELECT
            column_name AS name,
            
            CASE
                WHEN data_type IN ('integer','numeric')
                THEN 'Number'

                WHEN data_type = 'boolean'
                THEN 'Boolean'

                WHEN data_type IN ('JSONB', 'JSON')
                THEN 'Object'

                ELSE 'String'
            END AS type
        FROM information_schema.columns
        WHERE table_schema = '${db.tableSchema}'
        AND table_name = $(table)
    `, {table});
}

db.selectArr = async (table, args = {}) => {
    const query = `
        SELECT *
        FROM ${db.tableSchema}.${table}
        WHERE deleted_at IS NULL
    `;

    return await db.any(query);
}

db.insertObj = async (table, obj) => {
    const { cols, params } = paramsFromObj(obj);

    const query = `
        INSERT INTO ${db.tableSchema}.${table} (${_.join(cols, ', ')})
        VALUES (${_.join(params, ', ')})
        RETURNING *
    `;

    return await db.one(query, obj);
}

db.insertArr = async (table, arr) => {
    const { cols, params, objs } = paramsFromArr(arr);

    const query = `
        INSERT INTO ${db.tableSchema}.${table} (${_.join(cols, ', ')}) VALUES \n\t${_.join(params, ',\n\t')}
        RETURNING *
    `;

    return await db.any(query, objs);
}

db.updateObj = async (table, obj) => {
    const set = _.chain(obj)
        .omit(['id'])
        .map((val,key) => `${key} = $(${key})`)
        .join(',\n\t')
        .value();

    const query = `
        UPDATE ${db.tableSchema}.${table} SET \n\t${set}
        WHERE id = $(id)
        AND deleted_at IS NULL
        RETURNING *
    `;

    return await db.one(query, obj);
}

export default db;