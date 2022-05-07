import { expect, beforeAll, afterAll, afterEach, describe, it } from '@jest/globals';

import { Account } from '@models/account';

import * as db from './setup/db';

const userData = {
  username: 'user_test',
  email: 'test@gmail.com',
  password: 'Pass_test123',
  allergy: [],
};

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('Account model', () => {
  it('should be able to create a valid user', async () => {
    const validUser = new Account(userData);
    const savedUser = await validUser.save();

    expect(savedUser.id).toBeDefined();
    expect(savedUser.username).toStrictEqual(userData.username);
    expect(savedUser.email).toStrictEqual(userData.email);
  });
});
