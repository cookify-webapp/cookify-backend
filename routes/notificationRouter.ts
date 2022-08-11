import express from 'express';

import { auth } from '@middleware/auth';
import { countUnreadNotification, listNotification } from '@controllers/notificationController';

const notificationRouter = express.Router();

notificationRouter.get('/list', auth, listNotification);

notificationRouter.get('/unread', auth, countUnreadNotification);

export default notificationRouter;
