import { test, expect } from '@playwright/test';
import _ from 'lodash';
import fs from 'node:fs';

import ddb from '#config/sqlite-config';

const authToken = (await ddb('store').select('value').where({ key: 'authToken' }))[0].value;

let routeTests = [];
_.each(fs.readdirSync('./src/tests'), file => {
    if (file.includes('.route.js')) {
        file = _.replace(file, '.route.js', '');
    
        const routeTest = import(`#route-tests/${file}`);

        routeTests.push(routeTest);
    }
});

let ctx;
test.beforeAll(async ({ playwright }) => {
    ctx = await playwright.request.newContext({
        baseUrl: 'http://localhost:3000',
        extraHTTPHeaders: {
            'Authorization': `token ${authToken}`,
        }
    });
});

test.afterAll(async () => {
    await ctx.dispose();
});

_.each(routeTests, routeTest => routeTest.then(({ default: routeTest }) => {
    let {
        model,
        route,
        id,
        create,
        update,
        generate
    } = routeTest;

    const name = model.name;
    route = 'v1/' + _.toLower(route ?? name);

    if (!Object.hasOwn(model, 'noCreate')) {
        test(`${name}: create`, async () => {
            const re = await ctx.post(
                route,
                { data: create }
            );

            const json = await re.json()

            console.log(json);

            await expect(json).toBeTruthy();
        });

        test(`${name}: generate`, async () => {
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
        test(`${name}: get index`, async () => {
            const re = await ctx.get(route);

            const json = await re.json()

            console.log(json);

            await expect(json).toBeTruthy();
        });

        test(`${name}: get one`, async () => {
            const re = await ctx.get(`${route}/${id}`);

            const json = await re.json();

            console.log(json);

            await expect(json).toBeTruthy();
        });
    }

    if (!Object.hasOwn(model, 'noUpdate')) {
        test(`${name}: update`, async () => {
            const re = await ctx.post(
                `${route}/${id}`,
                { data: update },
            );

            const json = await re.json();

            console.log(json);

            await expect(json).toBeTruthy();
        });
    }
}));

await Promise.all(routeTests)