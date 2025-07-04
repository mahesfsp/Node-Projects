import { test, expect, request } from '@playwright/test';

test('GET /books should return 200 with valid token', async () => {
  const apiContext = await request.newContext();

  const loginResponse = await apiContext.post('http://localhost:3000/api/v1/auth/signin', {
    data: {
      username: 'admin1',
      password: 'Admin@123',
    },
  });

  expect(loginResponse.ok()).toBeTruthy();

  const loginBody = await loginResponse.json();
  console.log('Login response:', loginBody);

  const token = loginBody.data.accessToken;
  console.log('Token:', token);

  const booksResponse = await apiContext.get('http://localhost:3000/api/v1/books', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Books response status:', booksResponse.status());
  console.log('Books response body:', await booksResponse.json());

  expect(booksResponse.status()).toBe(200);
});
