export default class Controller {
    static async get (req, res) {
        if (Object.hasOwn(this.model, 'noGet')) {
            throw Error(`${model} has no get function`);
        }

        res.json(await this.model.get(req.query, true));
    }

    static async getOne (req, res) {
        if (Object.hasOwn(this.model, 'noGet')) {
            throw Error(`${this.model} has no get function`);
        }

        res.json((await this.model.get({ id: req.params.id }, true))[0]);
    }

    static async create (req, res) {
        if (Object.hasOwn(this.model, 'noCreate')) {
            throw Error(`${this.model} has no create function`);
        }

        res.json((await this.model.create(req.body))[0].id);
    }

    static async update (req, res) {
        if (Object.hasOwn(this.model, 'noUpdate')) {
            throw Error(`${this.model} has no update function`);
        }

        await this.model.update(req.body, { id: req.params.id })

        res.json();
    }

    static async delete (req, res) {
        if (Object.hasOwn(this.model, 'noUpdate')) {
            throw Error(`${this.model} has no update function`);
        }

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