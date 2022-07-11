import express from 'express';

import { getAdmins, getFollower, getFollowing, getUser } from '@controllers/accountController';
import { adminAuth, byPassAuth } from '@middleware/auth';
import { genericListValidator } from '@middleware/requestValidator';

const accountRouter = express.Router();

accountRouter.get('/:userId', byPassAuth, getUser);

accountRouter.get('/admin/list', adminAuth, genericListValidator, getAdmins);

accountRouter.get('/:userId/following', genericListValidator, getFollowing);

accountRouter.get('/:userId/follower', genericListValidator, getFollower);

export default accountRouter;
