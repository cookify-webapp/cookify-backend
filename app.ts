import createError, { HttpError } from "http-errors";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cookieParser from "cookie-parser";
import uniqueValidator from "mongoose-unique-validator";
import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "module-alias/register";

import indexRouter from "@routes/indexRouter";
import accountRouter from "@routes/accountRouter";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();

//---------------------
//   DATABASE
//---------------------
mongoose.connect(process.env.MONGODB_URL as string);
mongoose.plugin(uniqueValidator);
mongoose.plugin(mongooseAutoPopulate, {
  functions: ["find", "findOne", "findOneAndUpdate", "aggregate"],
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
const format =
  ":date[Asia/Bangkok] == :remote-user :method :url :status :response-time ms == :req[username] == :res[content-length]";

morgan.token("date", (_req, _res, tz) => {
  return dayjs()
    .tz(tz as string)
    .format("ddd, DD MMM YYYY HH:mm:ss");
});

app.use(
  morgan(format, {
    skip: (_req, res) => res.statusCode < 400,
    stream: fs.createWriteStream(path.resolve(__dirname, "log", "error.log"), {
      flags: "a",
    }),
  })
);

app.use(
  morgan(format, {
    stream: fs.createWriteStream(path.resolve(__dirname, "log", "access.log"), {
      flags: "a",
    }),
  })
);

//---------------------
//   ROUTES
//---------------------
app.use("/", indexRouter);
app.use("/users", accountRouter);

app.get("/health", (_req, res) => {
  res.send({ status: "This service is healthy." });
});

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

//---------------------
//   ERROR HANDLER
//---------------------
app.use(function (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    res
      .status(err.status || 500)
      .send({ name: err.name, message: err.message });
  } else if (err instanceof Error) {
    res.status(500).send({ name: err.name, message: err.message });
  } else {
    res
      .status(500)
      .send({ name: "Internal server error", message: "Something went wrong" });
  }
});

//---------------------
//   LISTENER
//---------------------
const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

export default app;
