import _ from 'lodash';
import multer, { memoryStorage } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import sharp from 'sharp';

import { firebaseStorage } from '@services/firebaseManager';
import createRestAPIError from '@error/createRestAPIError';

const maxSize = 5 * 1024 * 1024;

export const allowedExt = ['.png', '.jpg', '.gif', '.jpeg'];

const storage = memoryStorage();

export const generateFileName = (fileName?: string) => {
  if (!fileName) throw createRestAPIError('MISSING_IMG');
  return crypto.randomBytes(8).toString('hex') + path.extname(fileName);
};

export const uploadImage = async (folder: string, fileName: string, file?: Express.Multer.File | Buffer) => {
  if (!file) throw createRestAPIError('MISSING_IMG');

  const imagesRef = ref(firebaseStorage, `images/${process.env.NODE_ENV}/${folder}/${fileName}`);

  const optimizedFile = await sharp(file instanceof Buffer ? file : file.buffer)
    .resize(250, 250, { withoutEnlargement: true })
    .jpeg({ quality: 65, mozjpeg: true })
    .toBuffer();

  const task = await uploadBytes(imagesRef, optimizedFile);

  const downloadURL = await getDownloadURL(task.ref);

  return downloadURL;
};

export const deleteImage = async (imageType: string, fileName: string) => {
  const imagesRef = ref(firebaseStorage, `images/${process.env.NODE_ENV}/${imageType}/${fileName}`);

  await deleteObject(imagesRef);
};

export default multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!_.includes(allowedExt, ext)) return cb(createRestAPIError('IMG_EXT'));
    cb(null, true);
  },
  limits: { fileSize: maxSize },
});
