import _ from 'lodash';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

type ErrorResponseType = {
  [key: string]: {
    name: 'ValidatorError' | 'CastError';
    type: string;
    message: string;
    value: string;
  };
};

export default (err: mongoose.Error.ValidationError, req: Request, res: Response) => {
  if (err.errors) {
    const error: ErrorResponseType = {};

    _.forEach(Object.keys(err.errors), (path) => {
      const baseErr = err.errors[path];
      if (baseErr instanceof mongoose.Error.ValidatorError) {
        error[path] = {
          name: baseErr.name,
          type: baseErr.kind,
          message: baseErr.properties.message,
          value: baseErr.value,
        };
      }
      if (baseErr instanceof mongoose.Error.CastError) {
        error[path] = {
          name: baseErr.name,
          type: baseErr.kind,
          message: baseErr.message,
          value: baseErr.value,
        };
      }
    });

    return res.status(500).send({ status: 500, name: err.name, errors: error, method: req.method, path: req.path });
  }
};
