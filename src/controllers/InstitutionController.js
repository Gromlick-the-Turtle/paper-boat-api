import Controller from '#controllers/Controller';
import Institution from '#models/Institution';

export default class InstitutionController extends Controller {
    static model = Institution;

    static { this.init(); }
}