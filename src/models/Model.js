import db from '#config/db';
import _ from 'lodash';

export default class Model {
    static init() {
        _.each(this, (type, name) => {
            this.__defineSetter__(name, function (val) {
                if (_.isNull(val)) {
                    this[`#${name}`] = null;
                } else {
                    this[`#${name}`] = new type(val);
                }
            });

            this.__defineGetter__(name, function () {
                return this[`#${name}`];
            });
        });
    }

    static async get (opts = {}) {
        if (!this.table) {
            throw Error(`Table not defined for ${this}`);
        }

        if (Object.hasOwn(this, 'noGet')) {
            throw Error(`${this} has no get function`);
        }

        const items = await db.selectArr(this.table);
        return _.map(items, item => new this(item));
    }

    static async create (item) {
        if (!this.table) {
            throw Error(`Table not defined for ${this}`);
        }

        if (Object.hasOwn(this, 'noCreate')) {
            throw Error(`${this} has no create function`);
        }

        item = new this(item);

        let {id} = await db.insertObj(this.table, item.forDB());
        return id;
    }

    constructor (model) {
        model = _.mapKeys(model, (val,key) => _.camelCase(key));
        _.each(this.constructor, (type, name) => {
            if (!_.isUndefined(model[name])) {
                this[name] = model[name];
            }
        });
    }

    forDB () {
        return _.chain(this.constructor)
            .mapValues((val, key) => this[key])
            .mapKeys((val, key) => _.snakeCase(key))
            .pickBy(val => !_.isUndefined(val))
            .value();
    }
}