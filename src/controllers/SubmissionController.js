import _ from 'lodash';
import Controller from '#controllers/Controller';
import Submission from '#models/Submission';

import ForbiddenError from '#errors/ForbiddenError';

export default class SubmissionController extends Controller {
    withOrganization = false;
    model = Submission;

    async update (req, res) {
        const re = await Submission.get({ id: req.params.id });
        const userId = re?.[0]?.authorUserId;

        if (userId != req.authedUser.userId) {
            throw new ForbiddenError('You cannot change abstracts without permission');
        }

        await Submission.create(req.body);

        res.json(req.params.id);
    }
}