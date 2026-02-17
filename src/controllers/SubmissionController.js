import _ from 'lodash';
import Controller from '#controllers/Controller';
import Submission from '#models/Submission';

import ForbiddenError from '#errors/ForbiddenError';

export default class SubmissionController extends Controller {
    model = Submission;

    async checkAuth(params, user) {
        const re = await Submission.get({
            id: params.id,
            organizationId: user.organizationId,
        }, true);

        return re?.[0]?.authorUserId ?? false;
    }

    async create (req, res) {
        if (!(await this.checkAuth(req.body, req.authedUser))) {
            throw new ForbiddenError('You must submit to a permitted event');
        }

        res.json((await Submission.create(req.body))[0].id);
    }

    async update (req, res) {
        const authId = await this.checkAuth(req.params, req.authedUser);

        if (authId != req.authedUser.userId) {
            throw new ForbiddenError('You cannot change abstracts without permission');
        }

        await Submission.update(req.body, { id: req.params.id });

        res.json(req.params.id);
    }

    async delete (req, res) {
        if (!(await this.checkAuth(req.params, req.authedUser))) {
            throw new ForbiddenError('You are not permitted to delete that');
        }

        await Submission.delete({ id: req.params.id });

        res.json();
    }
}