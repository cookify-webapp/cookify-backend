import express from 'express';

import { auth } from '@middleware/auth';
import { listNotification } from '@controllers/notificationController';

const notificationRouter = express.Router();

notificationRouter.get('/list', auth, listNotification);

export default notificationRouter;
