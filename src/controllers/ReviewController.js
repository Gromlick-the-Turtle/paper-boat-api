import _ from 'lodash';
import Controller from '#controllers/Controller';
import Review from '#models/Review';
import Submission from '#models/Submission';

export default class ReviewController extends Controller {
    model = Review;

    async canCreate (params, user) {
        const re = await Submission.get({
            id: params.submissionId ?? -1,
            organizationId: user.organizationId ?? -1,
        }, true);

        return !!re.length;
    }
}