import SubmissionController from '#controllers/SubmissionController';

export default function SubmissionRoutes (router) {
    router.get('/submission',          SubmissionController..bind('get'));
    router.get('/submission/:id',      SubmissionController..bind('getOne'));
    router.post('/submission',         SubmissionController..bind('create'));
    router.post('/submission/:id',     SubmissionController..bind('update'));
    router.delete('/submission/:id',   SubmissionController..bind('delete'));
}