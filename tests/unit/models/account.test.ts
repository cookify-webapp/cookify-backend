import jwt from 'jsonwebtoken';
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

  it('should not allow insertion without required fields', async () => {
    const invalidUser = new Account({});

    await expect(invalidUser.save()).rejects.toThrow('is required');
  });

  it('should not allow invalid fields', async () => {
    const invalidUsername = new Account({ ...userData, username: 'this is something really really long' });
    const invalidAccountType = new Account({ ...userData, accountType: 'something else' });
    const invalidEmail = new Account({ ...userData, email: 'something else' });

    await expect(invalidUsername.save()).rejects.toThrow(
      /Path `username` \(`this is something really really long`\) is longer/
    );
    await expect(invalidAccountType.save()).rejects.toThrow(/(?=.*accountType)(?=.*not a valid enum value)/);
    await expect(invalidEmail.save()).rejects.toThrow('Path `email` is invalid');
  });

  it('should validate unique fields', async () => {
    const user = new Account(userData);
    const userDup = new Account(userData);
    await user.save();

    await expect(userDup.save()).rejects.toThrow(
      /(?=.*Expected username to be unique)(?=.*Expected email to be unique)/
    );
  });

  it('should return the correct document when searched', async () => {
    const user = new Account(userData);
    const savedUser = await user.save();
    const foundUser = await Account.findOne().byName(userData.username).exec();

    expect(savedUser.id).toStrictEqual(foundUser.id);
  });

  it('should sign jwt token correctly', async () => {
    const mockSecret = 'mOcKsEcRe4';
    const user = new Account(userData);
    const token = user.signToken(mockSecret);
    const decoded = jwt.verify(token, mockSecret) as jwt.JwtPayload;

    expect(decoded.username).toStrictEqual(userData.username);
    expect(decoded.isAdmin).toStrictEqual(false);
  });
});
