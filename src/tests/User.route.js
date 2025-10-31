import { faker } from '@faker-js/faker';

import User from '#models/User';

export default {
    model: User,
    route: 'user',
    id: 21,
    create: {},
    update: {
        nameLast: 'Toot'
    },
    generate: () => ({
        nameFirst: faker.person.firstName(),
        nameLast: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'x'
    })
}