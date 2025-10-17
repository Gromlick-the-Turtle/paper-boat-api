import db from '#config/db';
import _ from 'lodash';

export default class Model {
    static async _init() {
        if (_.isNil(this.table)) {
            throw Error (`Table not defined for ${this}`);
        }

        const fields = await db.getTableColumns(this.table);

        this.fields = _.chain(fields)
            .mapKeys(({ name, type }) => _.camelCase(name))
            .omit([ 'createdAt', 'updatedAt', 'deletedAt' ])
            .mapValues(({ name, type }) => type)
            .value();

        return true;
    }

    static init() {
        this.initialized = this._init();
    }

    static async get (opts = {}) {
        await this.initialized;

        if (Object.hasOwn(this, 'noGet')) {
            throw Error(`${this} has no get function`);
        }

        const items = await db.selectArr(this.table);
        return _.map(items, item => new this(item));
    }

    static async create (item) {
        await this.initialized;

        if (Object.hasOwn(this, 'noCreate')) {
            throw Error(`${this} has no create function`);
        }

        item = new this(item);

        const {id} = await db.insertObj(this.table, item.forDB());

        return id;
    }

    static async update (item) {
        await this.initialized;

        if (Object.hasOwn(this, 'noUpdate')) {
            throw Error(`${this} has no update function`);
        }

        item = new this(item);

        await db.updateObj(this.table, item.forDB());

        return true;
    }

    static async delete (item) {
        await this.initialized;

        if (Object.hasOwn(this, 'noDelete')) {
            throw Error(`${this} has no delete function`);
        }

        item = new this(item);

        await db.deleteObj(this.table, item.forDB());

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
                return item[name];
            }
        })

        Object.assign(this, model);
    }

    forDB () {
        return _.chain(this.constructor.fields)
            .mapValues((val, key) => this[key])
            .mapKeys((val, key) => _.snakeCase(key))
            .pickBy(val => !_.isUndefined(val))
            .value();
    }
}