import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class CustomForm extends Model {
    static table = 't_custom_form';

    static { this.init(); }
}