import express from 'express';

import { auth, byPassAuth } from '@middleware/auth';
import { genericListValidator, snapshotValidator } from '@middleware/requestValidator';
import imageUtil from '@utils/imageUtil';
import bodyParser from '@middleware/bodyParser';
import {
  createSnapshot,
  deleteSnapshot,
  editSnapshot,
  getSnapshotDetail,
  getSnapshotList,
} from '@controllers/snapshotController';

const middleware = [auth, imageUtil.single('snapshotImage'), bodyParser, snapshotValidator];

const snapshotRouter = express.Router();

snapshotRouter.get('/list', byPassAuth, genericListValidator, getSnapshotList);

snapshotRouter.get('/list/:username', genericListValidator, getSnapshotList);

snapshotRouter.get('/:snapshotId', byPassAuth, getSnapshotDetail);

snapshotRouter.post('/create', middleware, createSnapshot);

snapshotRouter.put('/:snapshotId/edit', middleware, editSnapshot);

snapshotRouter.delete('/:snapshotId/delete', auth, deleteSnapshot);

export default snapshotRouter;
