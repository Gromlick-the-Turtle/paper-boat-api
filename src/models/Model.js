import db from '#config/db';
import _ from 'lodash';

import ServerError from '#errors/ServerError';

export default class Model {
    static hidden = [];
    static fields = {};

    static init() {
        (async () => {
            if (_.isNil(this.table)) {
                throw Error (`Table not defined for ${this}`);
            }

            if (!_.isEmpty(this.fields)) {
                return;
            }

            const query = db
                .withSchema('information_schema')
                .select(
                    'column_name AS name',
                    db.raw(`
                        CASE
                            WHEN data_type IN ('integer','numeric')
                            THEN 'Number'

                            WHEN data_type = 'boolean'
                            THEN 'Boolean'

                            WHEN data_type IN ('JSONB', 'JSON')
                            THEN 'Object'

                            ELSE 'String'
                        END AS type
                    `)
                )
                .from('columns')
                .where({
                    table_schema: 'public',
                    table_name: this.table
                });

            // console.log(query.toSQL());

            const columns = await query;

            // console.log(this.name, this.table, columns);

            this.fields = _.chain(columns)
                .mapKeys(({ name, type }) => _.camelCase(name))
                .omit([ 'createdAt', 'updatedAt', 'deletedAt' ])
                .mapValues(({ name, type }) => {
                    if (_.isString(type)) {
                        return global[type];
                    } else {
                        return type;
                    }
                })
                .value();
        })()

        return true;
    }

    static keys () {
        return _.chain(this.fields)
            .keys()
            .without(...this.hidden)
            .value();
    }

    static hasOne(model, fColumn, lColumn) {
        return (query, name) => {
            name = name ?? model.name;
            
            fColumn = fColumn ?? 'id';
            lColumn = lColumn ?? `${name}_id`;

            let getter;

            if (new model() instanceof Model) {
                getter = model.get().as(name);
            } else if (_.isFunction(model)) {
                getter = model().as(name);
            } else {
                throw new ServerError(`hasOne first arg must be instance of Model or function`);
            }

            const subquery = db
                .select(fColumn, db.raw(
                    `TO_JSONB(${name}) AS ${name}`
                ))
                .from(db.raw('(SELECT 1) AS o'))
                .crossJoin(getter)
                .as(name)

            query
                .select(`${name}.${name}`)
                .leftJoin(
                    subquery,
                    `${name}.${fColumn}`,
                    `${this.table}.${lColumn}`
                );
        }
    }

    static hasMany(model, fColumn, lColumn)  {
        if (_.isNil(model) || !(new model() instanceof Model)) {
            throw new ServerError(`hasMany first arg must be instance of Model`);
        }

        return (query, name) => {
            name = name ?? model.name;
            
            fColumn = fColumn ?? `${this.name}_id`;
            lColumn = lColumn ?? `id`;

            const subquery = db
                .select(fColumn, db.raw(
                    `COALESCE (JSONB_AGG(${name}), JSONB('[]')) AS ${name}`
                ))
                .from(db.raw('(SELECT 1) AS o'))
                .crossJoin(model.get().as(name))
                .groupBy(fColumn)
                .as(name)

            query
                // .select(db.raw(
                //     `COALESCE(${name}.${name}, JSONB('[]')) `+
                //     `AS ${name}`
                // ))
                .select(`${name}.${name}`)
                .leftJoin(
                    subquery,                        
                    `${name}.${fColumn}`,
                    `${this.table}.${lColumn}`
                );
        }
    }

    static forDB (item) {
        return _.chain(this.fields)
            .pickBy((val,key) => !_.isUndefined(item[key]))
            .mapValues((val, key) => {
                if (val == Object) {
                    return JSON.stringify(item[key]);
                } else {
                    return item[key]?.valueOf();
                }
            })
            .value();
    }

    static get (params = {}, joins = false) {
        if (Object.hasOwn(this, 'noGet')) {
            throw new ServerError(`${this} has no get function`);
        }

        const query = db
            .select(..._.map(this.keys(), key => `${this.table}.${key}`))
            .from(this.table);

        if (joins) {
            _.each (this.joins, (func, name) => func(query, _.snakeCase(name)));
        }

        query.where(qry => {
                _.each(params, (val,key) => {
                    let [name, type] = _.split(key, ':');

                    if (_.isUndefined(name) || _.isUndefined(val)) {
                        return;
                    }

                    if (this.keys().includes(name)){
                        name = `${this.table}.${name}`;
                    }

                    if (_.isUndefined(type)) {
                        qry.where(name, val);
                    }
                });
            });

        if (Object.hasOwn(this.fields, 'deletedAt')) {
            query.whereNull(`${this.table}.deletedAt`);
        }

        return query;
    }

    static create (item) {
        if (Object.hasOwn(this, 'noCreate')) {
            throw new ServerError(`${this} has no create function`);
        }

        let params;

        if (_.isArray(item)) {
            params = _.map(item, i => _.pick(
                _.isArray(item) ? item[0] : item,
                _.keys(this.fields)
            ));
        } else {
            params = this.forDB(item);
        }

        return db(this.table)
            .insert(params)
            .returning('id');
    }

    static update (item, { id }) {
        if (Object.hasOwn(this, 'noUpdate')) {
            throw new ServerError(`${this} has no update function`);
        }

        const params = this.forDB(item);

        return db(this.table)
            .update(params)
            .where({ id });
    }

    static delete (item) {
        if (Object.hasOwn(this, 'noDelete')) {
            throw new ServerError(`${this} has no delete function`);
        }

        const params = this.forDB(item);

        return db(this.table)
            .update({ deleted_at: 'NOW()' })
            .where({ id: params.id });
    }

    constructor () {
        if(this.table) {
            Object.setPrototypeOf(this, db(this.table));
        }
    }

    withOne (name, model, fColumn, lColumn) {
        name = name ?? model.name;

        fColumn = fColumn ?? 'id';
        lColumn = lColumn ?? `${name}_id`;

        if (!Object.hasOwn(model, 'get')) {
            throw new ServerError('Invalid model');
        }

        const subquery = db
            .select(fColumn, db.raw(
                `TO_JSONB(${name}) AS ${name}`
            ))
            .from(db.raw('(SELECT 1) AS o'))
            .crossJoin(model.get().as(name))
            .as(name);

        return this.select(`${name}.${name}`)
            .leftJoin(
                subquery,
                `${name}.${fColumn}`,
                `${this.table}.${lColumn}`
            );
    }
}