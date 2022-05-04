import createError from 'http-errors';

import { allowedExt } from '@utils/imageUtil';

const ErrorDetail = Object.freeze({
  BAD_REQUEST: { name: createError(400).name, status: 400 },
  UNAUTHORIZED: { name: createError(401).name, status: 401 },
  FORBIDDEN: { name: createError(403).name, status: 403 },
  NOT_FOUND: { name: createError(404).name, status: 404 },
  INTERNAL_SERVER_ERROR: { name: createError(500).name, status: 500 },
});

const ErrorResponse = Object.freeze({
  //---------------------
  //   400
  //---------------------
  AUTH_HEADER: { ...ErrorDetail.BAD_REQUEST, msg: 'Multiple authentication headers detected' },
  IMG_EXT: { ...ErrorDetail.BAD_REQUEST, msg: `Invalid image extension, only ${allowedExt.join(' ')} are allowed` },
  INV_QUERY: { ...ErrorDetail.BAD_REQUEST, msg: 'Invalid request query(s)' },
  INV_REQ_BODY: { ...ErrorDetail.BAD_REQUEST, msg: 'Invalid request body' },

  //---------------------
  //   401
  //---------------------
  AUTH: { ...ErrorDetail.UNAUTHORIZED, msg: 'Please authenticate' },
  AUTH_ADMIN: { ...ErrorDetail.UNAUTHORIZED, msg: 'This account is not an admin' },

  //---------------------
  //   403
  //---------------------
  CORS: { ...ErrorDetail.FORBIDDEN, msg: 'Not allowed by CORS' },
  WRONG_USERNAME: { ...ErrorDetail.FORBIDDEN, msg: 'Incorrect username' },
  WRONG_PASSWORD: { ...ErrorDetail.FORBIDDEN, msg: 'Incorrect password' },
  DEL_REFERENCE: { ...ErrorDetail.FORBIDDEN, msg: 'Cannot delete referenced document' },

  //---------------------
  //   404
  //---------------------
  ACCOUNT_NOT_FOUND: { ...ErrorDetail.NOT_FOUND, msg: 'Account not found' },
  DOC_NOT_FOUND: { ...ErrorDetail.NOT_FOUND, msg: 'No documents found' },

  //---------------------
  //   500
  //---------------------
  MISSING_SECRET: { ...ErrorDetail.INTERNAL_SERVER_ERROR, msg: 'Missing token secret in environment' },
  MISSING_IMAGE_DIR: { ...ErrorDetail.INTERNAL_SERVER_ERROR, msg: 'Missing seed image directory in environment' },
});

export class RestAPIError extends Error {
  status: number;

  constructor(error: keyof typeof ErrorResponse) {
    super(ErrorResponse[error].msg);
    this.status = ErrorResponse[error].status;
    this.name = ErrorResponse[error].name;
  }
}

const createRestAPIError = (error: keyof typeof ErrorResponse) => new RestAPIError(error);

export default createRestAPIError;
