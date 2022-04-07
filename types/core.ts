import { NextFunction, Request, Response } from "express";

export type callbackType = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;
