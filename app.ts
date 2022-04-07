import createError from "http-errors";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import accountRouter from "./routes/accountRouter";

const app = express();

mongoose.connect("url");

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

//---------------------
//   ROUTES
//---------------------
app.use("/users", accountRouter);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, _req: Request, res: Response, _next: NextFunction) {
  res.status(err.status || 500);
  res.send({ error: err });
});

export default app;
