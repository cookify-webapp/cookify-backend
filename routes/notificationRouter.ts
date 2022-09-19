import express from 'express';

import { auth } from '@middleware/auth';
import { listNotification, readAllNotification, readNotification } from '@controllers/notificationController';

const notificationRouter = express.Router();

notificationRouter.get('/list', auth, listNotification);

notificationRouter.get('/read', auth, readAllNotification);

notificationRouter.get('/read/:notificationId', auth, readNotification);

export default notificationRouter;
