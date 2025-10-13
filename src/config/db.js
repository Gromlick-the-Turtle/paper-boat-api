import pgp from 'pg-promise';
import _ from 'lodash';

const db = pgp()({
    host: 'localhost',
    port: 8080,
    user: 'postgres',
    database: 'postgres',
    password: 'password'
});

const paramsFromObj = (obj) => {
    const cols = _.keys(obj);
    
    const params = _.map(cols, c => `$(${c})`);

    return { cols, params };
}

db.insertObj = async (table, obj) => {
    const { cols, params } = paramsFromObj(obj);

    const query = `
        INSERT INTO public.${table} (${_.join(cols, ', ')})
        VALUES (${_.join(params, ', ')})
        RETURNING *
    `;

    return await db.one(query, obj);
}

db.insertArr = async (table, arr) => {
    const { cols, params } = paramsFromObj(arr[0]);

    const objs = _.mapKeys(arr, (val,key) => `obj${key}`);

    const values = _.chain(objs)
        .map((obj,key) => {
            return '(' + 
                _.chain(cols)
                .map(col => `$(${key}.${col})`)
                .join(', ')
                .value() +
            ')';
        })
        .join(',\n\t')
        .value();

    const query = `
        INSERT INTO public.${table} (${_.join(cols, ', ')}) VALUES \n\t${values}
        RETURNING *
    `;

    return await db.any(query, objs);
}

db.updateObj = async (table, obj) => {
    const set = _.chain(obj)
        .map((val,key) => `${key} = $(${key})`)
        .join(',\n\t')
        .value();

    const query = `
        UPDATE public.${table} SET \n\t${set}
        RETURNING *
    `;

    return await db.one(query, obj);
}

export default db;