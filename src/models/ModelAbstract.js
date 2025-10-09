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
        _.each(this.constructor, (type, name) => {
            this[name] = model[name];
        });
    }
}