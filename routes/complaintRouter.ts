import express from 'express';

import {
  complaintListValidator,
  contactAuthorValidator,
  createComplaintValidator,
  updateComplaintValidator,
} from '@middleware/requestValidator';
import { adminAuth, auth } from '@middleware/auth';
import { deleteComplaint } from '../controllers/complaintController';
import {
  contactAuthor,
  createComplaint,
  getComplaintList,
  updateComplaintStatus,
} from '@controllers/complaintController';

const complaintRouter = express.Router();

complaintRouter.get('/list', adminAuth, complaintListValidator, getComplaintList);

complaintRouter.post('/create', auth, createComplaintValidator, createComplaint);

complaintRouter.put('/:complaintId/update', adminAuth, updateComplaintValidator, updateComplaintStatus);

complaintRouter.put('/:complaintId/contact', adminAuth, contactAuthorValidator, contactAuthor);

complaintRouter.delete('/:complaintId/delete', adminAuth, deleteComplaint);

export default complaintRouter;
