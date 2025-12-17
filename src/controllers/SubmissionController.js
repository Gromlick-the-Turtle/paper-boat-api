import _ from 'lodash';
import Controller from '#controllers/Controller';
import Submission from '#models/Submission';

export default class SubmissionController extends Controller {
    model = Submission; 
}