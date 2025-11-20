import Controller from '#controllers/Controller';
import CustomForm from '#models/CustomForm';

export default class CustomFormController extends Controller {
    static model = CustomForm;

    static { this.init(); }
}