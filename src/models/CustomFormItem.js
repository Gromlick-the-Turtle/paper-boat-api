import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class CustomFormItem extends Model {
    static table = 't_custom_form_item';

    static { this.init(); }
}