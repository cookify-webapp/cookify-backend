import express from 'express';

import {
  editProfile,
  getAdmins,
  getFollower,
  getFollowing,
  getUser,
  addPending,
  listPending,
  revokeRequest,
  verifyPending,
  deleteProfile,
} from '@controllers/accountController';
import { adminAuth, auth, byPassAuth } from '@middleware/auth';
import { adminListValidator, adminValidator, genericListValidator, userValidator } from '@middleware/requestValidator';
import imageUtil from '@utils/imageUtil';
import bodyParser from '@middleware/bodyParser';

const accountRouter = express.Router();

accountRouter.get('/:userId', byPassAuth, getUser);

accountRouter.get('/admin/list', adminAuth, adminListValidator, getAdmins);

accountRouter.get('/admin/pending/list', adminAuth, genericListValidator, listPending);

accountRouter.get('/:userId/following', genericListValidator, getFollowing);

accountRouter.get('/:userId/follower', genericListValidator, getFollower);

accountRouter.get('/admin/:uniqueKey/verify', verifyPending);

accountRouter.post('/admin/add', adminAuth, adminValidator, addPending);

accountRouter.put('/edit', auth, imageUtil.single('userImage'), bodyParser, userValidator, editProfile);

accountRouter.delete('/admin/:email/revoke', adminAuth, revokeRequest);

accountRouter.delete('/admin/:userId/delete', adminAuth, deleteProfile);

export default accountRouter;
