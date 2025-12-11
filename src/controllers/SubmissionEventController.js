import _ from 'lodash';
import Controller from '#controllers/Controller';
import SubmissionEvent from '#models/SubmissionEvent';
import CustomForm from '#models/CustomForm';

import ForbiddenError from '#errors/ForbiddenError';

export default class SubmissionEventController extends Controller {
    model = SubmissionEvent;

    async create (req, res) {
        const se = await SubmissionEvent.create(
            this.paramsWithPerms(req.body, req.authedUser)
        );

        const submissionEventId = se?.[0]?.id;

        await Promise.all([
            CustomForm.create({
                type: 'submission',
                submissionEventId,
                items: [],
            }),
            CustomForm.create({
                type: 'review',
                submissionEventId,
                items: [],
            })
        ]);

        res.json(submissionEventId)
    }

    async getForm (submissionEventId, authedUser, type) {
        const se = await SubmissionEvent.get(
            this.paramsWithPerms({ id: submissionEventId }, authedUser)
        );

        if (se?.[0]?.id != submissionEventId) {
            throw new ForbiddenError('You do not have permission to access that');
        }
        
        const cf = await CustomForm.get({
            submissionEventId,
            type,
        });

        return cf?.[0];
    }

    async getSubmissionForm (req, res) {
        const form = await this.getForm(req.params.id, req.authedUser, 'submission');
        res.json(form);
    }

    async getReviewForm (req, res) {
        const form = await this.getForm(req.params.id, req.authedUser, 'review');
        res.json(form);
    }
}