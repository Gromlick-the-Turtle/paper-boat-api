import _ from 'lodash';

export default class ModelAbstract {
    static init() {
        _.each(this, (type, name) => {
            this.__defineSetter__(name, function (val) {
                if (_.isNil(val)) {
                    this[`#${name}`] = val;
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
            this[name] = model[name];
        });
    }

    forDB () {
        return _.mapKeys(this, (val,key) => _.snakeCase(key));
    }
}