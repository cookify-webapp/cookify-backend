import { RequestHandler } from 'express';
import _ from 'lodash';

import { Account } from '@models/account';
import createRestAPIError from '@error/createRestAPIError';
import { Recipe } from '@models/recipe';
import { Snapshot } from '@models/snapshot';
import { Complaint, ComplaintStatus } from '@models/complaints';
import { createComplaintNotification } from '@functions/notificationFunction';

//---------------------
//   FETCH MANY
//---------------------
export const getComplaintList: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const status = req.query?.status as 'new' | 'processing' | 'done';

    const complaints = await Complaint.listComplaint(page, perPage, searchWord, status, res.locals.username);

    if (_.size(complaints.docs) > 0 || complaints.totalDocs > 0) {
      res.status(200).send({
        complaints: complaints.docs,
        page: complaints.page,
        perPage: complaints.limit,
        totalCount: complaints.totalDocs,
        totalPages: complaints.totalPages,
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   CREATE
//---------------------
export const createComplaint: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body?.data;

    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    data.type = _.capitalize(data.type);

    if (data.type === 'Recipe') {
      const post = await Recipe.findById(data?.post).exec();
      if (!post) throw createRestAPIError('DOC_NOT_FOUND');
    }

    if (data.type === 'Snapshot') {
      const post = await Snapshot.findById(data?.post).exec();
      if (!post) throw createRestAPIError('DOC_NOT_FOUND');
    }

    data.reporter = { _id: account._id, username: account.username };

    const complaint = new Complaint(data);

    await complaint.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   EDIT
//---------------------
export const updateComplaintStatus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.complaintId;

    const data = req.body?.data;

    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const complaint = await Complaint.findById(id).populate('post').exec();
    if (!complaint) throw createRestAPIError('DOC_NOT_FOUND');

    if (
      (data.status === ComplaintStatus.COMPLETED && complaint.status !== ComplaintStatus.VERIFYING) ||
      ((data.status === ComplaintStatus.REJECTED || data.status === ComplaintStatus.EXAMINING) &&
        complaint.status !== ComplaintStatus.FILED)
    )
      throw createRestAPIError('INVALID_FLOW');

    if (data.status === ComplaintStatus.EXAMINING) {
      const exist = await Complaint.findOne({
        post: complaint.post,
        status: { $in: [ComplaintStatus.EXAMINING, ComplaintStatus.IN_PROGRESS, ComplaintStatus.VERIFYING] },
      }).exec();
      if (exist) throw createRestAPIError('COMPLAINT_TAKEN');

      data.moderator = { _id: account._id, username: account.username };

      complaint.post.set({ isHidden: true });
      await complaint.post.save();
    }

    if (data.status === ComplaintStatus.COMPLETED || data.status === ComplaintStatus.REJECTED) {
      data.expiresAt = Date.now();

      if (data.status === ComplaintStatus.COMPLETED) {
        complaint.post.set({ isHidden: false });
        await complaint.post.save();
      }
    }

    complaint.set(data);

    await complaint.save();

    if (data.status === ComplaintStatus.COMPLETED)
      await createComplaintNotification(
        complaint.type.toLowerCase() as 'recipe' | 'snapshot',
        ComplaintStatus.COMPLETED,
        `/${complaint.type.toLowerCase()}s/${complaint.post.id}`,
        complaint.post.author._id
      );

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const contactAuthor: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.complaintId;

    const data = req.body?.data;

    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const complaint = await Complaint.findById(id).populate('post').exec();
    if (!complaint) throw createRestAPIError('DOC_NOT_FOUND');

    if (complaint.status !== ComplaintStatus.EXAMINING && complaint.status !== ComplaintStatus.VERIFYING)
      throw createRestAPIError('INVALID_FLOW');

    complaint.set({ status: ComplaintStatus.IN_PROGRESS });
    complaint.remarks.push(data.remark);

    await complaint.save();

    _.size(complaint.remarks) === 1 &&
      (await createComplaintNotification(
        complaint.type.toLowerCase() as 'recipe' | 'snapshot',
        ComplaintStatus.IN_PROGRESS,
        `/${complaint.type.toLowerCase()}s/${complaint.post.id}`,
        complaint.post.author._id
      ));

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   DELETE
//---------------------
export const deleteComplaint: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.complaintId;

    const complaint = await Complaint.findById(id).exec();
    if (!complaint) throw createRestAPIError('DOC_NOT_FOUND');
    if (complaint.status !== ComplaintStatus.COMPLETED) throw createRestAPIError('INCOMPLETE_COMPLAINT');

    await complaint.deleteOne();

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
