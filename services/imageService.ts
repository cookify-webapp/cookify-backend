import createError from "http-errors";
import _ from "lodash";
import multer from "multer";
import path from "path";

import { errorText } from "@coreTypes/core";

const storage = multer.diskStorage({
  destination: function (req, _file, cb) {
    cb(null, `public/images/${req.baseUrl.substring(1)}`);
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!_.includes([".png", ".jpg", ".gif", ".jpeg"], ext)) {
      return cb(createError(400, errorText.IMG_EXT));
    }
    cb(null, true);
  },
});
