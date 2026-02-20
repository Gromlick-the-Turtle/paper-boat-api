import db from '#config/db';
import _ from 'lodash';

import ModelList from '#models/ModelList';
import ServerError from '#errors/ServerError';

const casts = {
    number: Number,
    string: String,
    boolean: Boolean,
    object: Object,
    array: Array,
}

export default class Model {
    static tableName;

    static get table () {
        if (!this.tableName) {
            throw new ServerError('Table not defined');
        }

        return db(this.tableName);
    }

    static get model () {
        return new this();
    }

    static tableKey (key) {
        if (this.model[key] && !_.isFunction(this.model[key])) {
            return `${this.tableName}.${key}`;
        }
    }

    static get selectColumnKeys () {
        return _.chain(this.model)
            .keys()
            .map(key => this.tableKey(key))
            .filter()
            .value();
    }

    static paramColumnKeys (params) {
        return _.chain(params)
            .mapKeys((value, key) => this.tableKey(key))
            .value();
    }

    static factory (data) {
        if (_.isArray (data)) {
            return _.map(data, item => this.factory(item));
        } else {
            const item = {};

            _.forIn(this.model, (propType, propName) => {
                console.log(propName, propType)
                if (_.isFunction(propType)) {
                    propType = propType.name;
                }

                item[propName] = new casts[propType](data[propName]);
            });

            return item;
        }
    }

    static async insert (data) {
        data = this.factory(data);

        const [re] = await this.table.insert(data).returning('id');

        return re;
    }

    static async update (data, where) {
        data = this.factory(data);
        where = this.factory(data);

        const [re] = await this.table.update(data, where).returning('id');
    }

    static async delete (where) {
        where = this.factory(where);

        const [re] = await this.table.update({ deletedAt: 'NOW()' }, where).returning('id');

        return re;
    }

    static selectWhere (where) {
        const query = this.table
            .select(this.selectColumnKeys)
            .where(where);

        _.forIn(this.model, (propType, propName) => {
            if (_.isFunction(propType)) {
                propType(query)

                // const data = propType(query);

                // const snakeName = _.snakeCase(propName);

                // query
                //     .with(propName, data)
                //     .joinRaw(`LEFT JOIN ${snakeName} USING ${snakeName}_id`)
                //     .select(`${snakeName}.${snakeName}`)
            }
        })

        return query;
    }

    static forJoin () {
        const name = _.snakeCase(this.name);
        const keys = _.keys(this.model);

        keys.shift();

        keys.unshift(`id AS ${name}Id`);

        return this.table.select(keys);
    }

    static joinOne (query) {
        const name = _.snakeCase(this.name);

        query
            .with(name, this.forJoin())
            .joinRaw(`LEFT JOIN ${name} USING (${name}_id)`)
            .select(db.raw(`TO_JSONB(${name}) AS ${name}`));
    }

    static joinMany (query, foreignKey) {
        const name = _.snakeCase(this.name);
        const names = name + 's';

        foreignKey = _.snakeCase(foreignKey);

        const subquery = db
            .select(foreignKey, db.raw(`JSONB_AGG(${name}) AS ${names}`))
            .from(this.forJoin().as(name))
            .groupBy(foreignKey)

        query
            .with(name, subquery)
            .leftJoin(name, foreignKey, 'id')
            .select(names);
    }

//     static async selectWithJoins (where) {
//         where = this.factory(where);

// console.log(this)
//         const query = this.table.where(where);

//         _.forIn(this.model(), (propClass, propName) => {
//             if (new propClass() instanceof ModelList) {
//                 const subquery = db
//                     .select(
//                         `${this.name}Id`,
//                         db.raw(`JSONB_AGG(${propClass.model().tableName}) AS obj`),
//                     )
//                     .from(propClass.model().tableName)
//                     .groupBy(`${this.name}Id`)
//                     .as(_.snakeCase(propName));

//                 query
//                     .select(`${_.snakeCase(propName)}.obj AS ${propName}`)
//                     .leftJoin(
//                         subquery,
//                         `${_.snakeCase(propName)}.${this.name}Id`,
//                         `${this.tableName}.id`,
//                     );
//             }

//             else if (new propClass() instanceof Model) {
//                 const subquery = db
//                     .select(
//                         `id AS ${propName}Id2`,
//                         db.raw(`TO_JSONB(${propClass.tableName}) AS obj`)
//                     )
//                     .from(propClass.tableName)
//                     .as(_.snakeCase(propName));

//                 query
//                     .select(`${propName}.obj AS ${propName}`)
//                     .leftJoin(
//                         subquery,
//                         `${propName}Id2`,
//                         `${propName}Id`
//                     );
//             } else {
//                 query.select(`${this.tableName}.${propName}`);
//             }
//         });

//         return this.factory(await query);
//     }

    static async selectOne (id) {
        const [re] = await this.selectWhere({ id });

        return re;
    }

    // static async selectOneWithJoins (id) {
    //     const [re] = await this.selectWithJoins({ id })

    //     return re;
    // }

    static async selectAll () {
        return this.selectWhere({});
    }

    // constructor (item) {
        // _.forIn(this.constructor.model(), (propClass, propName) => {
        //     if (item?.[propName]) {
        //         this[propName] = new propClass(item[propName])
        //     }
        // })
    // }
}

// export default class Model {
//     static hidden = [];
//     static fields = {};

//     static keys () {
//         return _.chain(this.fields)
//             .keys()
//             .without(...this.hidden)
//             .value();
//     }

//     static hasOne(model, fColumn, lColumn) {
//         return (query, name) => {
//             name = name ?? model.name;
            
//             fColumn = fColumn ?? 'id';
//             lColumn = lColumn ?? `${name}_id`;

//             let getter;

//             if (new model() instanceof Model) {
//                 getter = model.get().as(name);
//             } else if (_.isFunction(model)) {
//                 getter = model().as(name);
//             } else {
//                 throw new ServerError(`hasOne first arg must be instance of Model or function`);
//             }

//             const subquery = db
//                 .select(fColumn, db.raw(
//                     `TO_JSONB(${name}) AS ${name}`
//                 ))
//                 .from(db.raw('(SELECT 1) AS o'))
//                 .crossJoin(getter)
//                 .as(name)

//             query
//                 .select(`${name}.${name}`)
//                 .leftJoin(
//                     subquery,
//                     `${name}.${fColumn}`,
//                     `${this.table}.${lColumn}`
//                 );
//         }
//     }

//     static hasMany(model, fColumn, lColumn)  {
//         if (_.isNil(model) || !(new model() instanceof Model)) {
//             throw new ServerError(`hasMany first arg must be instance of Model`);
//         }

//         return (query, name) => {
//             name = name ?? model.name;
            
//             fColumn = fColumn ?? `${this.name}_id`;
//             lColumn = lColumn ?? `id`;

//             const subquery = db
//                 .select(fColumn, db.raw(
//                     `COALESCE (JSONB_AGG(${name}), JSONB('[]')) AS ${name}`
//                 ))
//                 .from(db.raw('(SELECT 1) AS o'))
//                 .crossJoin(model.get().as(name))
//                 .groupBy(fColumn)
//                 .as(name)

//             query
//                 // .select(db.raw(
//                 //     `COALESCE(${name}.${name}, JSONB('[]')) `+
//                 //     `AS ${name}`
//                 // ))
//                 .select(`${name}.${name}`)
//                 .leftJoin(
//                     subquery,                        
//                     `${name}.${fColumn}`,
//                     `${this.table}.${lColumn}`
//                 );
//         }
//     }

//     static forDB (item) {
//         return _.chain(this.fields)
//             .pickBy((val,key) => !_.isUndefined(item[key]))
//             .mapValues((val, key) => {
//                 if (val == Object) {
//                     return JSON.stringify(item[key]);
//                 } else {
//                     return item[key]?.valueOf();
//                 }
//             })
//             .value();
//     }

//     static get (params = {}, joins = false) {
//         if (Object.hasOwn(this, 'noGet')) {
//             throw new ServerError(`${this} has no get function`);
//         }

//         const query = db
//             .select(..._.map(this.keys(), key => `${this.table}.${key}`))
//             .from(this.table);

//         if (joins) {
//             _.each (this.joins, (func, name) => func(query, _.snakeCase(name)));
//         }

//         query.where(qry => {
//                 _.each(params, (val,key) => {
//                     let [name, type] = _.split(key, ':');

//                     if (_.isUndefined(name) || _.isUndefined(val)) {
//                         return;
//                     }

//                     if (this.keys().includes(name)){
//                         name = `${this.table}.${name}`;
//                     }

//                     if (_.isUndefined(type)) {
//                         qry.where(name, val);
//                     }
//                 });
//             });

//         if (Object.hasOwn(this.fields, 'deletedAt')) {
//             query.whereNull(`${this.table}.deletedAt`);
//         }

//         return query;
//     }

//     static create (item) {
//         if (Object.hasOwn(this, 'noCreate')) {
//             throw new ServerError(`${this} has no create function`);
//         }

//         let params;

//         if (_.isArray(item)) {
//             params = _.map(item, i => _.pick(
//                 _.isArray(item) ? item[0] : item,
//                 _.keys(this.fields)
//             ));
//         } else {
//             params = this.forDB(item);
//         }

//         return db(this.table)
//             .insert(params)
//             .returning('id');
//     }

//     static update (item, { id }) {
//         if (Object.hasOwn(this, 'noUpdate')) {
//             throw new ServerError(`${this} has no update function`);
//         }

//         const params = this.forDB(item);

//         return db(this.table)
//             .update(params)
//             .where({ id });
//     }

//     static delete (item) {
//         if (Object.hasOwn(this, 'noDelete')) {
//             throw new ServerError(`${this} has no delete function`);
//         }

//         const params = this.forDB(item);

//         return db(this.table)
//             .update({ deleted_at: 'NOW()' })
//             .where(params);
//     }

//     constructor () {
//         if(this.table) {
//             Object.setPrototypeOf(this, db(this.table));
//         }
//     }

//     withOne (name, model, fColumn, lColumn) {
//         name = name ?? model.name;

//         fColumn = fColumn ?? 'id';
//         lColumn = lColumn ?? `${name}_id`;

//         if (!Object.hasOwn(model, 'get')) {
//             throw new ServerError('Invalid model');
//         }

//         const subquery = db
//             .select(fColumn, db.raw(
//                 `TO_JSONB(${name}) AS ${name}`
//             ))
//             .from(db.raw('(SELECT 1) AS o'))
//             .crossJoin(model.get().as(name))
//             .as(name);

//         return this.select(`${name}.${name}`)
//             .leftJoin(
//                 subquery,
//                 `${name}.${fColumn}`,
//                 `${this.table}.${lColumn}`
//             );
//     }
// }