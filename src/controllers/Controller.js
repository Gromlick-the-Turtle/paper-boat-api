import ServerError from '#errors/ServerError';

export default class Controller {
    static paramsWithPerms (params, authedUser) {
        if (Object.hasOwn(this, 'withOrganization')) {
            params.organizationId = authedUser[this.withOrganization ?? 'organizationId'];
        }

        return params;
    }

    static async get (req, res) {
        res.json(await this.model.get(
            this.paramsWithPerms(req.query, req.authedUser),
            true
        ));
    }

    static async getOne (req, res) {
        res.json((await this.model.get(
            this.paramsWithPerms({ id: req.params.id }, req.authedUser),
            true
        ))[0]);
    }

    static async create (req, res) {
        res.json((await this.model.create(
            this.paramsWithPerms(req.body, req.authedUser)
        ))[0].id);
    }

    static async update (req, res) {
        res.json(await this.model.update(
            req.body,
            this.paramsWithPerms({ id: req.params.id }, req.authedUser)
        ));
    }

    static async delete (req, res) {
        await this.model.delete(
            this.paramsWithPerms({ id: req.params.id }, req.authedUser)
        );

        res.json();
    }

    static init () {
        this.get    = this.get.bind(this);
        this.getOne = this.getOne.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
}