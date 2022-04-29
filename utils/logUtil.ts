import morgan from 'morgan';
import fs from 'fs';
import dayjs from 'dayjs';
import path from 'path';
import { RequestHandler } from 'express';
import { createStream, Generator, Options } from 'rotating-file-stream';

import { dateTimeNowTz } from '@utils/dateTimeUtil';

const format = ':date[Asia/Bangkok] == :remote-user :method :url :status :response-time ms == :res[content-length]';

const logOpt: Options = { omitExtension: true, interval: '7d', maxFiles: 4, history: 'log-history.txt' };

morgan.token('date', (_req, _res, tz) => {
  return dateTimeNowTz(tz as string).format('ddd, DD MMM YYYY HH:mm:ss');
});

const logName: (name: string) => Generator = (name) => (time: number | Date, index: number | undefined) => {
  if (!time) return path.resolve(process.cwd(), 'log', name, `${name}.log`);
  return path.resolve(process.cwd(), 'log', name, `${dayjs().format('YYYY-MMDD-HHmm')}-${index}-${name}.log`);
};

if (!fs.existsSync(path.resolve(process.cwd(), 'log')))
  fs.mkdirSync(path.resolve(process.cwd(), 'log'), { recursive: true });

export const errorLogger: RequestHandler = morgan(format, {
  skip: (_req, res) => res.statusCode < 400,
  stream: createStream(logName('error'), logOpt),
});

export const seedLogger: RequestHandler = morgan(format, {
  skip: (req, _res) => req.baseUrl !== '/seed',
  stream: createStream(logName('seed'), logOpt),
});

export const accessLogger: RequestHandler = morgan(format, {
  stream: createStream(logName('access'), logOpt),
});
