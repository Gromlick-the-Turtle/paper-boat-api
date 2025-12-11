import _ from 'lodash';
import Controller from '#controllers/Controller';
import SubmissionEvent from '#models/SubmissionEvent';
import CustomForm from '#models/CustomForm';

import ForbiddenError from '#errors/ForbiddenError';

export default class SubmissionEventController extends Controller {
    model = SubmissionEvent;

    async create (req, res) {
        const se = await SubmissionEvent.create(req.body);

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

    async authEvent ({ id, organizationId }) {
        const event = await SubmissionEvent.get({ id, organizationId });

        if (event?.[0]?.id != id) {
            throw new ForbiddenError('You do not have permission to access that');
        }
    }

    async getSubmissionForm ({ params: { id, organizationId } }, res) {
        await this.authEvent({ id, organizationId });

        const form = await CustomForm.get({ submissionEventId: id, type: 'submission' });

        res.json(form?.[0]);
    }

    async getReviewForm ({ params: { id, organizationId } }, res) {
        await this.authEvent({ id, organizationId });

        const form = await CustomForm.get({ submissionEventId: id, type: 'review' });

        res.json(form?.[0]);
    }

    async updateForm ({ params, body: { id, items } }, res) {
        await this.authEvent(params);

        const form = await CustomForm.update({ items }, { id });

        res.json(form?.[0])
    }
}