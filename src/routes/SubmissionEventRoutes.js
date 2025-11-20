import SubmissionEventController from '#controllers/SubmissionEventController';

export default function SubmissionEventRoutes (router) {
    router.get('/submission_event',          SubmissionEventController.get);
    router.get('/submission_event/:id',      SubmissionEventController.getOne);
    router.post('/submission_event',         SubmissionEventController.create);
    router.post('/submission_event/:id',     SubmissionEventController.update);
    router.delete('/submission_event/:id',   SubmissionEventController.delete);
}