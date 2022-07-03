import _ from 'lodash';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

const status: number = 500;

type ErrorResponseType = {
  [key: string]: {
    name: 'ValidatorError' | 'CastError';
    type: string;
    message: string;
    value: string;
  };
};

export default (err: mongoose.Error.ValidationError, req: Request, res: Response) => {
  const error: ErrorResponseType = {};

  _.forEach(Object.keys(err.errors), (path) => {
    const baseErr = err.errors[path];
    error[path] = {
      name: baseErr.name,
      type: baseErr.kind,
      message: baseErr instanceof mongoose.Error.ValidatorError ? baseErr.properties.message : baseErr.message,
      value: baseErr.value,
    };
  });

  const result = { status, name: err.name, errors: error, method: req.method, path: req.path };

  return res.status(status).send(result);
};
