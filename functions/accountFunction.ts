import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { AccountInstanceInterface } from '@models/account';

export const comparePassword: (this: AccountInstanceInterface, password: string) => Promise<boolean> = function (
  password
) {
  return bcrypt.compare(password, decodeURIComponent(this.password));
};

export const hashPassword: (this: AccountInstanceInterface) => Promise<void> = async function () {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
};

export const signToken: (this: AccountInstanceInterface, secret: string) => string = function (secret) {
  return jwt.sign({ username: this.username, isAdmin: this.accountType === 'admin' }, secret, {
    expiresIn: '24h',
  });
};
