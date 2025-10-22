import db from '#config/db';
import _ from 'lodash';

export default class Model {
    static hidden = [];
    static fields = {};

    static async _init() {
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

        return true;
    }

    static init() {
        this.initialized = this._init();
    }

    static keys () {
        return _.chain(this.fields)
            .keys()
            .without(...this.hidden)
            .value();
    }

    static keysDB () {
        return _.map(this.keys(), key => {
            return `${this.table}.${_.snakeCase(key)}`;
        });
    }

    static async get (params = {}) {
        await this.initialized;

        if (Object.hasOwn(this, 'noGet')) {
            throw Error(`${this} has no get function`);
        }

        const query = db
            .select(this.keysDB())
            .from(this.table);

        _.each (this.stubs, (val,key) => {
            query.select(`${val.table}.name AS ${key}_name`);
            val.joinStub(query, `${this.table}.${key}_id`);
        })

        query.where(qry => {
                _.each(params, (val,key) => {
                    const [name, type] = _.split(key, ':');

                    if (_.isUndefined(name) || _.isUndefined(val)) {
                        return;
                    }

                    if (_.isUndefined(type)) {
                        qry.where(name, val);
                    }
                });
            })
            .whereNull(`${this.table}.deleted_at`);

        return _.map(await query, row => {
            return new this(row);
        });
    }

    static async joinStub (query, on) {
        query.leftJoin(
            this.table,
            on,
            `${this.table}.id`
        );
    }

    static async create (item) {
        await this.initialized;

        if (Object.hasOwn(this, 'noCreate')) {
            throw Error(`${this} has no create function`);
        }

        const params = (new this(item)).forDB();

        const re = await db(this.table)
            .insert(params)
            .returning('id');

        return re[0].id;
    }

    static async update (item, { id }) {
        await this.initialized;

        if (Object.hasOwn(this, 'noUpdate')) {
            throw Error(`${this} has no update function`);
        }

        const params = (new this(item)).forDB();

        await db(this.table)
            .update(params)
            .where({ id });

        return true;
    }

    static async delete (item) {
        await this.initialized;

        if (Object.hasOwn(this, 'noDelete')) {
            throw Error(`${this} has no delete function`);
        }

        const params = (new this(item)).forDB();

        await db(this.table)
            .update({ deleted_at: 'NOW()' })
            .where({ id: params.id });

        return true;
    }

    constructor (item) {
        if (_.isNil(this.constructor.initialized)) {
            throw Error (`${this.constructor} has not been initialized, await static init() function`);
        }

        if (!_.isObject(item)) {
            throw Error (`${this.constructor} constructor error: item is not object`);
        }

        item = _.mapKeys(item, (val,key) => _.camelCase(key));

        const model = _.mapValues(this.constructor.fields, (type, name) => {
            if (!_.isUndefined(item[name])) {
                return new type(item[name]);
            }
        });

        _.each (this.constructor.stubs, (type, name) => {
            if (!_.isNil(item[`${name}Id`])) {
                model[name] = {
                    id: item[`${name}Id`],
                    label: item[`${name}Name`]
                }

                delete item[`${name}Id`];
            }
        });

        Object.assign(this, model);
    }

    forDB () {
        return _.chain(this.constructor.fields)
            .pickBy((val,key) => !_.isUndefined(this[key]))
            .mapValues((val, key) => this[key].valueOf())
            .mapKeys((val, key) => _.snakeCase(key))
            .value();
    }
}