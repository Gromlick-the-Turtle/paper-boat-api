import _ from 'lodash';

import db from '#config/db';
import Model from '#models/Model';

export default class UserOrganization extends Model {
    static table = 't_user_organization';

    static { this.init(); }
}