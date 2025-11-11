import Controller from '#controllers/Controller';
import User from '#models/User';

export default class UserController extends Controller {
    static model = User;

    static withOrganization;

    static async getProfile (req, res) {
        res.json((await User.getProfile(req.authedUser.userId))[0]);
    }

    static { this.init(); }
}