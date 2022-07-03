import { RequestHandler } from 'express';

const bodyParser: RequestHandler = (req, _res, next) => {
  if (typeof req.body.data === 'string') req.body.data = JSON.parse(req.body.data);
  next();
};

export default bodyParser;
