import _ from 'lodash';

import ServerError from '#errors/ServerError';
import ForbiddenError from '#errors/ForbiddenError';

export default class Controller {
    model = {};

    // set this to false if it isn't there
    withOrganization (req, res, next) {
        // for index calls
        if (req.query) {
            req.query.organizationId = req.authedUser.organizationId;
        }

        // create/update calls
        if (req.body) {
            req.body.organizationId = req.authedUser.organizationId;
        }

        // calls affecting *one* row (getOne, update, delete)
        if (req.params) {
            req.params.organizationId = req.authedUser.organizationId;
        }

        next()
    }

    async canGet (params, user) { return true; }

    async get (req, res) {
        if (!(await this.canGet(req.query, req.authedUser))) {
            throw new ForbiddenError('You are not permitted to do that')
        }

        res.json(await this.model.selectWithJoins(req.query));
    }

    async getOne (req, res) {
        if (!(await this.canGet(req.params, req.authedUser))) {
            throw new ForbiddenError('You are not permitted to do that')
        }

        res.json(await this.model.selectOneWithJoins(req.params.id));
    }

    async canCreate (params, user) { return true; }

    async create (req, res) {
        if (!(await this.canCreate(req.body, req.authedUser))) {
            throw new ForbiddenError('You are not permitted to do that');
        }

        res.json((await this.model.insert(req.body)).id);
    }

    async canUpdate ({ id }, { organizationId }) {
        const re = await this.model.get({ id, organizationId }, true);

        return !!re.length;
    }

    async update (req, res) {
        if (!(await this.canUpdate(req.params, req.authedUser))) {
            throw new ForbiddenError('You are not permitted to do that');
        }

        res.json(await this.model.update(req.body, { id: req.params.id }));
    }

    async canDelete ({ id }, { organizationId }) {
        const re = await this.model.get({ id, organizationId}, true);

        return !!re.length;
    }

    async delete (req, res) {
        if (!(await this.canDelete(req.params, req.authedUser))) {
            throw new ForbiddenError('You are not permitted to do that');
        }

        await this.model.delete({ id: req.params.id });

        res.json();
    }

    static bind (func) {
        const me = new this();
        return _.filter([me.withOrganization, me[func].bind(me)]);
    }
}