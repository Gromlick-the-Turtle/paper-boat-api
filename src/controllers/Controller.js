import ServerError from '#errors/ServerError';

export default class Controller {
    static async get (req, res) {
        res.json(await this.model.get(req.query, true));
    }

    static async getOne (req, res) {
        res.json((await this.model.get({ id: req.params.id }, true))[0]);
    }

    static async create (req, res) {
        res.json((await this.model.create(req.body))[0].id);
    }

    static async update (req, res) {
        res.json(await this.model.update(req.body, { id: req.params.id }));
    }

    static async delete (req, res) {
        await this.model.delete({ id: req.params.id });
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