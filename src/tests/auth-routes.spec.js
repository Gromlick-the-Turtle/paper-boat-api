import { test, expect } from '@playwright/test';
import _ from 'lodash';
import db from '#config/sqlite-config';

let ctx;
test.beforeAll(async ({ playwright }) => {
    ctx = await playwright.request.newContext({
        baseUrl: 'http://localhost:3000',
    });
});

test.afterAll(async () => {
    await ctx.dispose();
});

test('Auth: login', async () => {
    const re = await ctx.post('/auth/login', { data: {
        email: 'sally.buttz@email.com',
        password: 'password',
    }});

    const json = await re.json();

    await db('store')
        .insert({ key: 'authToken', value: json.token })
        .onConflict('key')
        .merge();

    console.log(json);

    await expect(json).toBeTruthy();
});