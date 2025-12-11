import ServerError from '#errors/ServerError';

export default class Controller {
    model = {};

    paramsWithPerms (params, authedUser) {
        if (Object.hasOwn(this, 'withOrganization')) {
            params.organizationId = authedUser[this.withOrganization ?? 'organizationId'];
        }

        return params;
    }

    async get (req, res) {
        console.log(this)
        res.json(await this.model.get(
            this.paramsWithPerms(req.query, req.authedUser),
            true
        ));
    }

    async getOne (req, res) {
        res.json((await this.model.get(
            this.paramsWithPerms({ id: req.params.id }, req.authedUser),
            true
        ))[0]);
    }

    async create (req, res) {
        res.json((await this.model.create(
            this.paramsWithPerms(req.body, req.authedUser)
        ))[0].id);
    }

    async update (req, res) {
        res.json(await this.model.update(
            req.body,
            this.paramsWithPerms({ id: req.params.id }, req.authedUser)
        ));
    }

    async delete (req, res) {
        await this.model.delete(
            this.paramsWithPerms({ id: req.params.id }, req.authedUser)
        );

        res.json();
    }

    static bind (func) {
        const me = new this();
        return me[func].bind(me);
    }
}