import createError, { HttpError } from 'http-errors';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import uniqueValidator from 'mongoose-unique-validator';
import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import morgan from 'morgan';
import fs from 'fs';
import { createStream, Generator, Options } from 'rotating-file-stream';
import path from 'path';
import 'module-alias/register';
import cors from 'cors';
import dayjs from 'dayjs';

import indexRouter from '@routes/indexRouter';
import accountRouter from '@routes/accountRouter';
import seedRouter from '@routes/seedRouter';
import { dateTimeNowTz } from '@utils/dateTimeUtil';
import createRestAPIError, { RestAPIError } from '@error/createRestAPIError';

const app = express();

//---------------------
//   CORS
//---------------------
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || process.env.ORIGIN?.split(' ').includes(origin)) {
        cb(null, true);
      } else {
        cb(createRestAPIError('CORS'));
      }
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
  })
);

//---------------------
//   DATABASE
//---------------------
mongoose.connect(process.env.MONGODB_URL as string);
mongoose.plugin(uniqueValidator);
mongoose.plugin(mongooseAutoPopulate, {
  functions: ['find', 'findOne', 'findOneAndUpdate', 'aggregate'],
});
mongoose.plugin(mongoosePaginate);
mongoose.plugin(aggregatePaginate);

//---------------------
//   MODULES
//---------------------
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

//---------------------
//   LOGGER
//---------------------
const format = ':date[Asia/Bangkok] == :remote-user :method :url :status :response-time ms == :res[content-length]';

morgan.token('date', (_req, _res, tz) => {
  return dateTimeNowTz(tz as string).format('ddd, DD MMM YYYY HH:mm:ss');
});

const logName: (name: string) => Generator = (name) => (time: number | Date, index: number | undefined) => {
  if (!time) return path.resolve(__dirname, 'log', name, `${name}.log`);
  return path.resolve(__dirname, 'log', name, `${dayjs().format('YYYY-MMDD-HHmm')}-${index}-${name}.log`);
};

const logOpt: Options = { omitExtension: true, interval: '7d', maxFiles: 4, history: 'log-history.txt' };

if (!fs.existsSync('log')) fs.mkdirSync('log', { recursive: true });

app.use(
  morgan(format, {
    skip: (_req, res) => res.statusCode < 400,
    stream: createStream(logName('error'), logOpt),
  })
);

app.use(
  morgan(format, {
    skip: (req, _res) => req.baseUrl !== '/seed',
    stream: createStream(logName('seed'), logOpt),
  })
);

app.use(
  morgan(format, {
    stream: createStream(logName('access'), logOpt),
  })
);

//---------------------
//   ROUTES
//---------------------
app.use('/', indexRouter);
app.use('/accounts', accountRouter);
app.use('/seed', seedRouter);

app.get('/health', (_req, res) => {
  res.send({ status: 'This service is healthy.' });
});

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

//---------------------
//   ERROR HANDLER
//---------------------
app.use(function (err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError || err instanceof RestAPIError) {
    const status = err.status || 500;
    res.status(status).send({ status, name: err.name, message: err.message, method: req.method, path: req.path });
  } else if (err instanceof Error) {
    res.status(500).send({ status: 500, name: err.name, message: err.message, method: req.method, path: req.path });
  } else {
    res.status(500).send({
      status: 500,
      name: createError(500).name,
      message: 'Something went wrong',
      method: req.method,
      path: req.path,
    });
  }
});

//---------------------
//   LISTENER
//---------------------
const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

export default app;
