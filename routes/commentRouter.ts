import express from 'express';

import { createComment, editComment, getCommentList } from '@controllers/commentController';
import { createCommentValidator, editCommentValidator, genericListValidator } from '@middleware/requestValidator';
import { auth, byPassAuth } from '@middleware/auth';

const commentRouter = express.Router();

commentRouter.get('/:sourceType/:sourceId/list', byPassAuth, genericListValidator, getCommentList);

commentRouter.post('/:sourceType/:sourceId/create', auth, createCommentValidator, createComment);

commentRouter.put('/:commentId/edit', auth, editCommentValidator, editComment);

export default commentRouter;
