import { faker } from '@faker-js/faker';

import Review from '#models/Review';

export default {
    model: Review,
    route: 'review',
    id: 1,
    create: {},
    update: {},
    generate: () => ({})
}