import createError from 'http-errors';
import _ from 'lodash';
import multer from 'multer';
import path from 'path';

import { errorText } from '@coreTypes/core';

const maxSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    cb(null, `public/images/${req.baseUrl.substring(1)}`);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!_.includes(['.png', '.jpg', '.gif', '.jpeg'], ext)) {
      return cb(createError(400, errorText.IMG_EXT));
    }
    cb(null, true);
  },
  limits: {
    fileSize: maxSize,
  },
});
