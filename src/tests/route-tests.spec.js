import { test, expect } from '@playwright/test';
import _ from 'lodash';

import User from '#route-tests/User';

let ctx;
test.beforeAll(async ({ playwright }) => {
    ctx = await playwright.request.newContext({
        baseUrl: 'http://localhost:3000',
    });
});

test.afterAll(async () => {
    await ctx.dispose();
});

_.each([User], ({ model, route, id, create, update, generate }) => {
    const name = model.name;
    route = _.toLower(route ?? name);

    if (!Object.hasOwn(model, 'noCreate')) {
        test(`Create ${name}`, async () => {
            const re = await ctx.post(
                route,
                { data: create }
            );

            const json = await re.json()

            console.log(json);

            await expect(json).toBeTruthy();
        });

        test(`Generate ${name}`, async () => {
            const re = await ctx.post(
                route,
                { data: generate() }
            );

            const json = await re.json();

            console.log(json);

            await expect(json).toBeTruthy();
        });
    }

    if (!Object.hasOwn(model, 'noGet')) {
        test(`Get ${name} index`, async () => {
            const re = await ctx.get(route);

            const json = await re.json()

            console.log(json);

            await expect(json).toBeTruthy();
        });

        test(`Get one ${name}`, async () => {
            const re = await ctx.get(`${route}/${id}`);

            const json = await re.json();

            console.log(json);

            await expect(json).toBeTruthy();
        });
    }

    if (!Object.hasOwn(model, 'noUpdate')) {
        test(`Update ${name} index`, async () => {
            const re = await ctx.post(
                `${route}/${id}`,
                { data: update },
            );

            const json = await re.json();

            console.log(json);

            await expect(json).toBeTruthy();
        });
    }
});