import SubmissionEventController from '#controllers/SubmissionEventController';

export default function SubmissionEventRoutes (router) {
    router.get('/submission_event',          SubmissionEventController.bind('get'));
    router.get('/submission_event/:id',      SubmissionEventController.bind('getOne'));
    router.post('/submission_event',         SubmissionEventController.bind('create'));
    router.post('/submission_event/:id',     SubmissionEventController.bind('update'));
    router.delete('/submission_event/:id',   SubmissionEventController.bind('delete'));

    router.get('/submission_event/:id/submission_form', SubmissionEventController.bind('getSubmissionForm'));
    router.post('/submission_event/:id/submission_form', SubmissionEventController.bind('updateForm'));

    router.get('/submission_event/:id/review_form', SubmissionEventController.bind('getReviewForm'));
    router.post('/submission_event/:id/review_form', SubmissionEventController.bind('updateForm'));
}