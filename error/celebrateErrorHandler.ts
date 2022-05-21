import _ from 'lodash';
import { Request, Response } from 'express';
import { CelebrateError } from 'celebrate';
import HTTP from 'http';

const status: number = 400;

type ValidationType = {
  [segment: string]: {
    [path: string]: string;
  };
};

export default (err: CelebrateError, req: Request, res: Response) => {
  const validation: ValidationType = {};

  _.forEach(Array.from(err.details.entries()), ([segment, joiError]) => {
    validation[segment] = {};
    _.forEach(joiError.details, (detail) => {
      validation[segment][detail.path.join('.')] = detail.message;
    });
  });

  const result = {
    status,
    name: HTTP.STATUS_CODES[400],
    message: err.message,
    validation,
    method: req.method,
    path: req.path,
  };

  return res.status(status).send(result);
};
