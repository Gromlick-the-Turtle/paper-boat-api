import SubmissionEventController from '#controllers/SubmissionEventController';
import CustomFormController from '#controllers/CustomFormController';

export default function SubmissionEventRoutes (router) {
    router.get('/submission_event',          SubmissionEventController.get);
    router.get('/submission_event/:id',      SubmissionEventController.getOne);
    router.post('/submission_event',         SubmissionEventController.create);
    router.post('/submission_event/:id',     SubmissionEventController.update);
    router.delete('/submission_event/:id',   SubmissionEventController.delete);

    router.get('/submission_event/:id/submission_form', SubmissionEventController.getSubmissionForm);
    router.get('/submission_event/:id/review_form', SubmissionEventController.getReviewForm);
}