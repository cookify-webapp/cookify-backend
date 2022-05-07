import { describe, it, expect } from '@jest/globals';

import { Account } from '@models/account';

const userData = {
  username: 'user_test',
  email: 'test@gmail.com',
  password: 'Pass_test123',
};

describe('Account model', () => {
  it('should be able to create a valid user', async () => {
    const validUser = new Account(userData);
    await validUser.hashPassword();
    const savedUser = await validUser.save();
    const isPasswordEqual = await savedUser.comparePassword(userData.password);

    // Test insert
    expect(savedUser.id).toBeDefined();
    expect(savedUser.username).toStrictEqual(userData.username);
    expect(savedUser.email).toStrictEqual(userData.email);
    // Test defaults
    expect(savedUser.accountType).toStrictEqual('user');
    expect(savedUser.allergy).toEqual([]);
    expect(savedUser.bookmark).toEqual([]);
    expect(savedUser.following).toEqual([]);
    expect(savedUser.image).toEqual('');
    // Test hashed password
    expect(isPasswordEqual).toEqual(true);
  });

  it('should not allow invalid account types', async () => {
    const invalidUser = new Account({ ...userData, accountType: 'something else' });
    await invalidUser.hashPassword();

    await expect(invalidUser.save()).rejects.toThrow(/(?=.*accountType)(?=.*not a valid enum value)/);
  });

  it('should validate unique fields', async () => {
    const user = new Account(userData);
    const userDup = new Account(userData);
    await user.save();

    await expect(userDup.save()).rejects.toThrow(
      /(?=.*Expected username to be unique)(?=.*Expected email to be unique)/
    );
  });
});
