import _ from 'lodash';
import { faker } from '@faker-js/faker';

import db from '#config/pg-config';
import Address from '#models/Address';
import Institution from '#models/Institution';
import User from '#models/User';

const randomId = async model => {
    const { min, max } = (
        await db(model.table)
        .min('id')
        .max('id')
        .select()
    )[0];

    const approxId = faker.number.int({ min, max });

    return (
        await db(model.table)
        .select('id')
        .where('id', '<=', approxId)
        .limit(1)
    )[0].id;
};

export default {
    address: async addr => {
        const address = {
            line1: faker.location.streetAddress(),
            stateId: faker.number.int({ min: 1, max: 50 }),
            countryId: 1,
            zip: faker.number.int({ min: 12345, max: 99999 }),
            ...addr
        };

        await Address.create(address);

        return address;
    },

    institution: async inst => {
        const institution = {
            name: faker.company.name(),
            description: faker.lorem.paragraph(5),
            addressId: await randomId(Address),
            ...inst
        };

        await Institution.create(institution);

        return institution;
    }
}