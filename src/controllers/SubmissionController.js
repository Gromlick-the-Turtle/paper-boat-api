import _ from 'lodash';
import Controller from '#controllers/Controller';
import Submission from '#models/Submission';
import SubmissionEvent from '#models/SubmissionEvent';

import ForbiddenError from '#errors/ForbiddenError';

export default class SubmissionController extends Controller {
    model = Submission;

    async canCreate (params, user) {
        const re = await SubmissionEvent.get({
            id: params.submissionEventId ?? -1,
            organizationId: user.organizationId ?? -1,
        });

        return !!re.length;
    }
}