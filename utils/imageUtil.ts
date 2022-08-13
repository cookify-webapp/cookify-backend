import _ from 'lodash';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import createRestAPIError from '@error/createRestAPIError';

const maxSize = 5 * 1024 * 1024;

export const allowedExt = ['.png', '.jpg', '.gif', '.jpeg'];

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.resolve(process.cwd(), `public/images${req.baseUrl}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`);
  },
});

export const deleteImage = (imageType: string, fileName: string) =>
  fs.unlinkSync(path.resolve(process.cwd(), 'public', 'images', imageType, fileName));

export default multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!_.includes(allowedExt, ext)) return cb(createRestAPIError('IMG_EXT'));
    cb(null, true);
  },
  limits: { fileSize: maxSize },
});
