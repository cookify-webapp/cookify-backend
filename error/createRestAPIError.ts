import HTTP from 'http';

import { allowedExt } from '@utils/imageUtil';

const ErrorDetail = Object.freeze({
  BAD_REQUEST: { name: HTTP.STATUS_CODES[400], status: 400 },
  UNAUTHORIZED: { name: HTTP.STATUS_CODES[401], status: 401 },
  FORBIDDEN: { name: HTTP.STATUS_CODES[403], status: 403 },
  NOT_FOUND: { name: HTTP.STATUS_CODES[404], status: 404 },
  INTERNAL_SERVER_ERROR: { name: HTTP.STATUS_CODES[500], status: 500 },
});

const ErrorResponse = Object.freeze({
  //---------------------
  //   400
  //---------------------
  IMG_EXT: { ...ErrorDetail.BAD_REQUEST, msg: `Invalid image extension, only ${allowedExt?.join(' ')} are allowed` },

  //---------------------
  //   401
  //---------------------
  AUTH: { ...ErrorDetail.UNAUTHORIZED, msg: 'Please authenticate' },
  AUTH_ADMIN: { ...ErrorDetail.UNAUTHORIZED, msg: 'This account is not an admin' },

  //---------------------
  //   403
  //---------------------
  CORS: { ...ErrorDetail.FORBIDDEN, msg: 'Not allowed by CORS' },
  DEL_REFERENCE: { ...ErrorDetail.FORBIDDEN, msg: 'Cannot delete referenced document' },
  DUP_COMMENT: { ...ErrorDetail.FORBIDDEN, msg: 'You have already commented on this post' },
  NOT_OWNER: { ...ErrorDetail.FORBIDDEN, msg: 'You are not the owner of this document' },
  WRONG_PASSWORD: { ...ErrorDetail.FORBIDDEN, msg: 'Incorrect password' },
  WRONG_USERNAME: { ...ErrorDetail.FORBIDDEN, msg: 'Incorrect username' },

  //---------------------
  //   404
  //---------------------
  ACCOUNT_NOT_FOUND: { ...ErrorDetail.NOT_FOUND, msg: 'Account not found' },
  DOC_NOT_FOUND: { ...ErrorDetail.NOT_FOUND, msg: 'No documents found' },

  //---------------------
  //   500
  //---------------------
  MISSING_IMAGE_DIR: { ...ErrorDetail.INTERNAL_SERVER_ERROR, msg: 'Missing seed image directory in environment' },
  MISSING_SECRET: { ...ErrorDetail.INTERNAL_SERVER_ERROR, msg: 'Missing token secret in environment' },

  //---------------------
  //   DEPRECATED
  //---------------------
  // AUTH_HEADER: { ...ErrorDetail.BAD_REQUEST, msg: 'Multiple authentication headers detected' },
  // INV_QUERY: { ...ErrorDetail.BAD_REQUEST, msg: 'Invalid request query(s)' },
  // INV_REQ_BODY: { ...ErrorDetail.BAD_REQUEST, msg: 'Invalid request body' },
});

export class RestAPIError extends Error {
  status: number;

  constructor(error: keyof typeof ErrorResponse) {
    super(ErrorResponse[error].msg);
    this.status = ErrorResponse[error].status;
    this.name = ErrorResponse[error].name || '';
  }
}

export default (error: keyof typeof ErrorResponse) => new RestAPIError(error);
