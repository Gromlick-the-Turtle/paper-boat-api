export default class Controller {
    static async get (model, req, res) {
        if (Object.hasOwn(model, 'noGet')) {
            throw Error(`${model} has no get function`);
        }

        res.json(await this.model.get(req.query));
    }

    static async getOne (model, req, res) {
        if (Object.hasOwn(this.model, 'noGet')) {
            throw Error(`${this.model} has no get function`);
        }

        res.json((await this.model.get({ id: req.params.id }))[0]);
    }

    static async create (model, req, res) {
        if (Object.hasOwn(this.model, 'noCreate')) {
            throw Error(`${this.model} has no create function`);
        }

        res.json(await this.model.create(req.body));
    }

    static async update (model, req, res) {
        if (Object.hasOwn(this.model, 'noUpdate')) {
            throw Error(`${this.model} has no update function`);
        }

        res.json(await this.model.update(req.body, { id: req.params.id }));
    }

    static async delete (model, req, res) {
        if (Object.hasOwn(this.model, 'noUpdate')) {
            throw Error(`${this.model} has no update function`);
        }

        await this.model.delete({ id: req.params.id });
        res.json();
    }

    static init () {
        this.get    = this.get.bind(this, this.model);
        this.getOne = this.getOne.bind(this, this.model);
        this.create = this.create.bind(this, this.model);
        this.update = this.update.bind(this, this.model);
        this.delete = this.delete.bind(this, this.model);
    }
}