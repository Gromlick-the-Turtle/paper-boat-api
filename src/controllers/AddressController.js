import Controller from '#controllers/Controller';
import Address from '#models/Address';

export default class AddressController extends Controller {
    static model = Address;

    static { this.init(); }
}