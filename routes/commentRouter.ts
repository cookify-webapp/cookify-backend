import express from 'express';

import {
  createComment,
  deleteComment,
  editComment,
  getCommentList,
  getMyComment,
} from '@controllers/commentController';
import { createCommentValidator, editCommentValidator, genericListValidator } from '@middleware/requestValidator';
import { auth, byPassAuth } from '@middleware/auth';

const commentRouter = express.Router();

commentRouter.get('/:sourceType/:sourceId', auth, getMyComment);

commentRouter.get('/:sourceType/:sourceId/list', byPassAuth, genericListValidator, getCommentList);

commentRouter.post('/:sourceType/:sourceId/create', auth, createCommentValidator, createComment);

commentRouter.put('/:commentId/edit', auth, editCommentValidator, editComment);

commentRouter.delete('/:commentId/delete', auth, deleteComment);

export default commentRouter;
