import db from '#config/db';
import _ from 'lodash';

export default class Model {
    static hidden = [];
    static fields = {};

    static init() {
        (async () => {
            if (_.isNil(this.table)) {
                throw Error (`Table not defined for ${this}`);
            }

            const columns = await db
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
        return _.chain({ ...this.fields, ...this.joins })
            .keys()
            .without(...this.hidden)
            .value();
    }

    static keysDB () {
        return _.map(_.keys(this.fields), key => {
            return _.snakeCase(key);
        });
    }

    static hasOne(model, fColumn, lColumn) {
        if (_.isNil(model) || !(new model() instanceof Model)) {
            throw Error(`hasOne first arg must be instance of Model`);
        }

        return (query, name) => {
            name = name ?? _.snakeCase(model.name);
            
            fColumn = fColumn ?? 'id';
            lColumn = lColumn ?? `${name}_id`;

            const keys = _.chain(model.keysDB())
                .map(key => `${model.table}.${key} AS ${name}_${key}`)
                .value();

            query
                .select(keys)
                .leftJoin(
                    model.table,
                    `${model.table}.${fColumn}`,
                    `${this.table}.${lColumn}`
                );
        }
    }

    // static hasOneThrough(
    //     model, mModel,
    //     fColumn, lColumn,
    //     mfColumn, mlColumn
    // ) {
    //     if (_.isNil(model) || !(new model() instanceof Model)) {
    //         throw Error(`hasOneThrough first arg must be instance of Model`);
    //     }

    //     if (_.isNil(mModel) || !(new mModel() instanceof Model)) {
    //         throw Error(`hasOneThrough second arg must be instance of Model`);
    //     }

    //     return (query, name, mName) => {
    //         name = name ?? _.snakeCase(model.name);
    //         mName = mName ?? _.snakeCase(mModel.name);

    //         fColumn = fColumn ?? 'id';
    //         lColumn = lColumn ?? `${name}_id`;

    //         mfColumn = mfColumn ?? 'id';
    //         mlColumn = mlColumn ?? `${mName}_id`;

    //         const keys = _.chain(model.keysDB())
    //             .map(key => `${model.table}.${key} AS ${name}_${key}`)
    //             .value();

    //         query
    //             .select(keys)
    //             .leftJoin(
    //                 mModel.table,
    //                 `${mModel.table}.${mfColumn}`,
    //                 `${this.table}.${mlColumn}`
    //             )
    //             .leftJoin(
    //                 model.table,
    //                 `${model.table}.${fColumn}`,
    //                 `${mModel.table}.${lColumn}`
    //             );
    //     }
    // }

    static hasMany(model, fColumn, lColumn)  {
        if (_.isNil(model) || !(new model() instanceof Model)) {
            throw Error(`hasMany first arg must be instance of Model`);
        }

        return (query, name) => {
            name = name ?? _.snakeCase(model.name);
            
            fColumn = fColumn ?? `${_.snakeCase(this.name)}_id`;
            lColumn = lColumn ?? `id`;

            const keys = _.chain(model.keysDB())
                .map(key => `${model.table}.${key}`)
                .value();

            const subquery = db
                .select(fColumn, db.raw(`
                    JSONB_AGG(${model.table})
                    AS ${name}
                `))
                .from(model.table)
                .groupBy(fColumn)
                .as(name)

            query
                .select(db.raw(`
                    COALESCE(${name}.${name}, JSONB('[]'))
                    AS ${name}
                `))
                .leftJoin(
                    subquery,                        
                    `${name}.${fColumn}`,
                    `${this.table}.${lColumn}`
                );
        }
    }

    static get (params = {}, joins = false) {
        if (Object.hasOwn(this, 'noGet')) {
            throw Error(`${this} has no get function`);
        }

        const query = db
            .select(..._.map(this.keysDB(), key => `${this.table}.${key}`))
            .from(this.table);

        if (joins)
        _.each (this.joins, (func, name) => {
            func(query, name);
        });

        query.where(qry => {
                _.each(params, (val,key) => {
                    const [name, type] = _.split(key, ':');

                    if (_.isUndefined(name) || _.isUndefined(val)) {
                        return;
                    }

                    if (_.isUndefined(type)) {
                        qry.where(`${this.table}.${name}`, val);
                    }
                });
            });

        if (Object.hasOwn(this.fields, 'deletedAt')) {
            query.whereNull(`${this.table}.deleted_at`);
        }

        return query;
    }

    static create (item) {
        if (Object.hasOwn(this, 'noCreate')) {
            throw Error(`${this} has no create function`);
        }

        const params = _.chain(item)
            .pick(_.keys(this.fields))
            .mapKeys((val,key) => _.snakeCase(key))
            .value();

        return db(this.table)
            .insert(params)
            .returning('id');
    }

    static update (item, { id }) {
        if (Object.hasOwn(this, 'noUpdate')) {
            throw Error(`${this} has no update function`);
        }

        const params = (new this(item)).forDB();

        return db(this.table)
            .update(params)
            .where({ id });
    }

    static delete (item) {
        if (Object.hasOwn(this, 'noDelete')) {
            throw Error(`${this} has no delete function`);
        }

        const params = (new this(item)).forDB();

        return db(this.table)
            .update({ deleted_at: 'NOW()' })
            .where({ id: params.id });
    }

    constructor (item = {}) {
        if (!_.isObject(item)) {
            throw Error (`${this.constructor.name} constructor error: item is not object`);
        }

        item = _.mapKeys(item, (val,key) => _.camelCase(key));

        item = _.mapValues({
            ...this.constructor.fields,
            ...this.constructor.joins
        }, (type, name) => {
            if (_.isUndefined(item[name])) {
                return;
            } else {
                return item[name]
            }
        });

        item = _.pick(item, this.constructor.keys());

        Object.assign(this, item);
    }

    forDB () {
        return _.chain(this.constructor.fields)
            .pickBy((val,key) => !_.isUndefined(this[key]))
            .mapValues((val, key) => this[key].valueOf())
            .mapKeys((val, key) => _.snakeCase(key))
            .value();
    }
}