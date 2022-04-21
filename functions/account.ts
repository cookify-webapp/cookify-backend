import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { accountSchema } from '@models/account';

//---------------------
//   METHODS
//---------------------
accountSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, decodeURIComponent(this.password));
};

accountSchema.methods.signToken = function (secret: string): string {
  return jwt.sign({ username: this.username, isAdmin: this.accountType === 'admin' }, secret, {
    expiresIn: '24h',
  });
};
