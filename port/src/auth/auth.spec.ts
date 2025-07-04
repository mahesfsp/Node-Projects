import { test, expect, request } from '@playwright/test';

test('GET /users should return 200 with valid admin token', async () => {
  const apiContext = await request.newContext();

  // 1. Sign in as admin
  const loginResponse = await apiContext.post(
    'http://localhost:3000/api/v1/auth/signin',
    {
      data: {
        email_address: 'admin@example.com',
        password: 'Pass@1234',
      },
    },
  );

  expect(loginResponse.ok()).toBeTruthy();

  const loginBody = await loginResponse.json();
  console.log('Login response:', loginBody);

  // 2. Get token directly (no .data wrapper if you returned { accessToken } in signIn)
  const token = loginBody.accessToken;
  console.log('Token:', token);

  // 3. Request /users
  const usersResponse = await apiContext.get(
    'http://localhost:3000/api/v1/auth/users',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log('Users response status:', usersResponse.status());
  const body = await usersResponse.json();
  console.log('Users response body:', body);

  expect(usersResponse.status()).toBe(200);
  expect(Array.isArray(body)).toBe(true); // verify it's a user list
});
