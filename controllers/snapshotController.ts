import { RequestHandler } from 'express';
import _ from 'lodash';

import { Comment } from '@models/comment';
import { Account } from '@models/account';
import createRestAPIError from '@error/createRestAPIError';
import { Recipe } from '@models/recipe';
import { Snapshot } from '@models/snapshot';
import { deleteImage } from '@utils/imageUtil';

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

    const account = await Account.findById(snapshot.author._id).select('image').lean().exec();

    snapshot.isMe = res.locals.username === snapshot.author.username;
    snapshot.author.image = account?.image || '';

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

    data.image = req.file?.filename;
    data.recipe = { _id: recipe._id, name: recipe.name };
    data.author = { _id: account._id, username: account.username };

    const snapshot = new Snapshot(data);

    await snapshot.save();
    res.status(200).send({ message: 'success' });
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

    const oldImage = snapshot.image;

    snapshot.set({
      caption: data.caption,
      image: req.file?.filename || snapshot.image,
    });

    if (data.recipe !== snapshot.recipe._id.toHexString()) {
      const recipe = await Recipe.findById(data?.recipe).exec();
      if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

      snapshot.set({
        recipe: { _id: recipe._id, name: recipe.name },
      });
    }

    await snapshot.save();
    oldImage && snapshot.image !== oldImage && deleteImage('snapshots', oldImage);
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
    snapshot.image && deleteImage('snapshots', snapshot.image);

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
