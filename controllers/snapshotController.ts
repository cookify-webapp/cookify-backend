import { RequestHandler } from 'express';
import _ from 'lodash';

import { Comment } from '@models/comment';
import { Account } from '@models/account';
import createRestAPIError from '@error/createRestAPIError';
import { Recipe } from '@models/recipe';
import { Snapshot } from '@models/snapshot';
import { deleteImage, generateFileName, uploadImage } from '@utils/imageUtil';
import { Complaint, ComplaintStatus } from '@models/complaints';
import { createVerifyNotification } from '@functions/notificationFunction';

//---------------------
//   FETCH MANY
//---------------------
export const getSnapshotList: RequestHandler = async (req, res, next) => {
  try {
    const username = req.params?.username;

    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);

    const snapshots = await Snapshot.listAll(page, perPage, username);

    if (_.size(snapshots.docs) > 0 || snapshots.totalDocs > 0) {
      res.status(200).send({
        snapshots: snapshots.docs,
        page: snapshots.page,
        perPage: snapshots.limit,
        totalCount: snapshots.totalDocs,
        totalPages: snapshots.totalPages,
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   FETCH ONE
//---------------------
export const getSnapshotDetail: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.snapshotId;

    const snapshot = await Snapshot.findById(id).lean().exec();
    if (!snapshot) throw createRestAPIError('DOC_NOT_FOUND');

    const { accountType } = await Account.findOne()
      .setOptions({ autopopulate: false })
      .byName(res.locals.username)
      .select('accountType')
      .lean()
      .exec();
    const account = await Account.findById(snapshot.author._id).select('image').lean().exec();

    snapshot.isMe = res.locals.username === snapshot.author.username;
    snapshot.author.image = account?.image || '';

    if (snapshot.isHidden && !snapshot.isMe && accountType !== 'admin') throw createRestAPIError('DOC_NOT_FOUND');

    const complaint = await Complaint.findOne({
      type: 'Snapshot',
      post: snapshot._id,
      status: { $in: [ComplaintStatus.IN_PROGRESS, ComplaintStatus.VERIFYING] },
    }).exec();

    res.status(200).send({ snapshot: complaint ? { ...snapshot, remark: complaint.remarks.pop() } : snapshot });

    res.status(200).send({ snapshot });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   CREATE
//---------------------
export const createSnapshot: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body?.data;

    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const recipe = await Recipe.findById(data?.recipe).exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

    data.imageName = generateFileName(req.file?.originalname);
    data.image = await uploadImage('snapshots', data.imageName, req.file);

    data.recipe = { _id: recipe._id, name: recipe.name };
    data.author = { _id: account._id, username: account.username };

    const snapshot = new Snapshot(data);

    await snapshot.save();
    res.status(200).send({ id: snapshot.id });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   EDIT
//---------------------
export const editSnapshot: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.snapshotId;

    const data = req.body?.data;

    const snapshot = await Snapshot.findById(id).setOptions({ autopopulate: false }).exec();
    if (!snapshot) throw createRestAPIError('DOC_NOT_FOUND');
    if (snapshot.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    const imageName = snapshot.imageName || (req.file ? generateFileName(req.file?.originalname) : '');

    snapshot.set({
      caption: data.caption,
      imageName,
      image: req.file ? await uploadImage('snapshots', imageName, req.file) : snapshot.image,
    });

    if (data.recipe !== snapshot.recipe._id.toHexString()) {
      const recipe = await Recipe.findById(data?.recipe).exec();
      if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

      snapshot.set({
        recipe: { _id: recipe._id, name: recipe.name },
      });
    }

    await snapshot.save();

    if (snapshot.isHidden) {
      const complaint = await Complaint.findOneAndUpdate(
        { type: 'Snapshot', post: snapshot.id, status: ComplaintStatus.IN_PROGRESS },
        { status: ComplaintStatus.VERIFYING }
      );
      if (!complaint) throw createRestAPIError('DOC_NOT_FOUND');

      await createVerifyNotification(
        'recipe',
        snapshot.author.username,
        ComplaintStatus.VERIFYING,
        `/complaints?id=${snapshot.id}&tabType=inprogress`,
        complaint.moderator._id
      );
    }

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   DELETE
//---------------------
export const deleteSnapshot: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.snapshotId;

    const snapshot = await Snapshot.findById(id).exec();
    if (!snapshot) throw createRestAPIError('DOC_NOT_FOUND');
    if (snapshot.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    await snapshot.deleteOne();

    await Comment.deleteMany({ post: snapshot._id }).exec();
    snapshot.image && (await deleteImage('snapshots', snapshot.imageName));

    if (snapshot.isHidden) {
      const complaint = await Complaint.findOneAndUpdate(
        { type: 'Snapshot', post: snapshot.id, status: ComplaintStatus.IN_PROGRESS },
        { status: ComplaintStatus.DELETED }
      );
      if (!complaint) throw createRestAPIError('DOC_NOT_FOUND');

      await createVerifyNotification(
        'recipe',
        snapshot.author.username,
        ComplaintStatus.DELETED,
        `/complaints?id=${snapshot.id}&tabType=completed`,
        complaint.moderator._id
      );
    }

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
