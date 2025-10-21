import { test, expect } from '@playwright/test';

let ctx;
const vars = {};

test.beforeAll(async ({ playwright }) => {
    ctx = await playwright.request.newContext({
        baseUrl: 'http://localhost:3000',
    });
});

test.afterAll(async () => {
    await ctx.dispose();
})

test('Create user', async () => {
    const user = {
        nameFirst: 'Sally',
        nameLast: 'Wilson',
        email: 'sally.wilson@email.com',
        password: 'x'
    }

    const re = await ctx.post('user', { data: user });
    vars.id = await re.json();

    console.log('id', vars.id);

    await expect(vars.id).toEqual(expect.any(Number));
});

test('Get users', async () => {
    const re = await ctx.get('user');
    vars.users = await re.json();

    console.log(vars.users);

    await expect(vars.users).toBeTruthy()
});

test('Get user', async () => {
    const re = await ctx.get('user/21');
    vars.user = await re.json();

    console.log(vars.user);

    await expect(vars.user).toBeTruthy()
});