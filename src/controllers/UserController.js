import Controller from '#controllers/Controller';
import User from '#models/User';

export default class UserController extends Controller {
    static model = User;

    static { this.init(); }
}