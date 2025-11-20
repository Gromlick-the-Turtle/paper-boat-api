import Controller from '#controllers/Controller';
import SubmissionEvent from '#models/SubmissionEvent';

export default class SubmissionEventController extends Controller {
    static model = SubmissionEvent;

    static { this.init(); }
}