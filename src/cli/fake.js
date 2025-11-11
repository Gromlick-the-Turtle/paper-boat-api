import _ from 'lodash';
import { faker } from '@faker-js/faker';

import db from '#config/pg-config';
import Address from '#models/Address';
import Institution from '#models/Institution';
import User from '#models/User';

export default {
    address: async addr => {
        const address = {
            line1: faker.location.streetAddress(),
            stateId: faker.number.int({ min: 1, max: 50 }),
            countryId: 1,
            zip: faker.number.int({ min: 12345, max: 99999 }),
            ...addr
        };

        console.log(address);

        await Address.create(address);

        return address;
    },

    institution: async inst => {
        const { min, max } = (
            await db(Address.table)
                .min('id')
                .max('id')
                .select()
        )[0];

        const approxAddrId = faker.number.int({ min, max });

        const addressId = (
            await db(Address.table)
            .select('id')
            .where('id', '<=', approxAddrId)
            .limit(1)
        )[0].id;

        const institution = {
            name: faker.company.name(),
            description: faker.lorem.paragraph(5),
            addressId,
            ...inst
        };

        await Institution.create(institution);

        return institution;
    }
}