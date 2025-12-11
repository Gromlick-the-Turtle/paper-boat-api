import _ from 'lodash';

import ServerError from '#errors/ServerError';

export default class Controller {
    model = {};

    // set this to false if it isn't there
    withOrganization (req, res, next) {
        if (req.query) {
            req.query.organizationId = req.authedUser.organizationId;
        }

        if (req.body) {
            req.body.organizationId = req.authedUser.organizationId;
        }

        if (req.params) {
            req.params.organizationId = req.authedUser.organizationId;
        }

        next()
    }

    async get (req, res) {
        res.json(await this.model.get(req.query, true));
    }

    async getOne ({ params: { id, organizationId } }, res) {
        res.json((await this.model.get({ id, organizationId }, true))[0]);
    }

    async create (req, res) {
        res.json((await this.model.create(req.body))[0].id);
    }

    async update ({ body, params: { id, organizationId } }, res) {
        res.json(await this.model.update(req.body, { id, organizationId }));
    }

    async delete ({ params: { id, organizationId } }, res) {
        await this.model.delete({ id, organizationId });

        res.json();
    }

    static bind (func) {
        const me = new this();
        return _.filter([me.withOrganization, me[func].bind(me)]);
    }
}