import { AccountInstanceInterface } from '@models/account';

declare global {
  namespace Express {
    export interface Request {
      username?: string;
    }
  }
}
