import { faker } from '@faker-js/faker';

import Address from '#models/Address';

export default {
    model: Address,
    route: 'address',
    id: 1,
    create: {},
    update: {},
    generate: () => ({})
}