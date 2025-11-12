import _ from 'lodash';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import db from '#config/pg-config';

import Address from '#models/Address';
import Institution from '#models/Institution';
import User from '#models/User';
import UserOrganization from '#models/UserOrganization';

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
    async address (address) {
        address = {
            line1: faker.location.streetAddress(),
            stateId: faker.number.int({ min: 1, max: 50 }),
            countryId: 1,
            zip: faker.number.int({ min: 12345, max: 99999 }),
            ...address
        };

        await Address.create(address);

        return address;
    },

    async institution (institution) {
        institution = {
            name: faker.company.name(),
            description: faker.lorem.paragraph(5),
            addressId: await randomId(Address),
            ...institution
        };

        await Institution.create(institution);

        return institution;
    },

    async user (user, userOrganization) {
        user = {
            nameFirst: faker.person.firstName(),
            nameLast: faker.person.lastName(),
            email: faker.internet.email(),
            password: await bcrypt.hash('password', 10),
            institutionId: await randomId(Institution),
            ...user,
        };

        const userId = (await User.create(user))[0].id;

        const role = faker.number.int({ min: 1, max: 3 });

        userOrganization = {
            userId,
            organizationId: 1,
            isAdmin: role==1,
            isReviewer: role==2,
            isAuthor: role==3,
            ...userOrganization,
        };

        await UserOrganization.create(userOrganization);

        return { userOrganization, ...user };
    },

    async author (user, userOrganization) {
        return this.user(user, {
            isAdmin: false,
            isReviewer: false,
            isAuthor: true,
            ...userOrganization,
        });
    },

    async reviewer (user, userOrganization) {
        return this.user(user, {
            isAdmin: false,
            isReviewer: true,
            isAuthor: false,
            ...userOrganization,
        });
    },

    async admin (user, userOrganization) {
        return this.user(user, {
            isAdmin: false,
            isReviewer: false,
            isAuthor: true,
            ...userOrganization,
        });
    },
}