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