import createError, { HttpError } from "http-errors";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import indexRouter from "./routes/indexRouter";
import accountRouter from "./routes/accountRouter";

const app = express();

//---------------------
//   DATABASE
//---------------------
await mongoose.connect(process.env.MONGODB_URL as string);

//---------------------
//   MODULES
//---------------------
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

//---------------------
//   ROUTES
//---------------------
app.use("/", indexRouter);
app.use("/users", accountRouter);

// Catch 404 and forward to error handler
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
    res.status(err.status || 500).send({ message: err.message });
  } else if (err instanceof Error) {
    res.status(500).send({ name: err.name, message: err.message });
  } else {
    res.status(500).send({ message: "Internal server error" });
  }
});

export default app;
