import { AccountInstanceInterface } from "../../models/account";

declare global {
  declare namespace Express {
    export interface Request {
      account?: AccountInstanceInterface;
    }
  }
}