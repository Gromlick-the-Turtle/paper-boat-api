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

db.selectArr = async (table, args = {}) => {
    const query = `
        SELECT *
        FROM public.${table}
        WHERE deleted_at IS NULL
    `;

    return await db.any(query);
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
    const { cols, params, objs } = paramsFromArr(arr);

    const query = `
        INSERT INTO public.${table} (${_.join(cols, ', ')}) VALUES \n\t${_.join(params, ',\n\t')}
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