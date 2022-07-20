import { RequestHandler } from 'express';
import _ from 'lodash';

import { Comment } from '@models/comment';
import { Account } from '@models/account';
import createRestAPIError from '@error/createRestAPIError';
import { Recipe } from '@models/recipe';
import { Snapshot } from '@models/snapshot';

//---------------------
//   FETCH MANY
//---------------------
export const getCommentList: RequestHandler = async (req, res, next) => {
  try {
    const type = req.params?.sourceType;
    const id = req.params?.sourceId;

    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);

    const comments = await Comment.listAll(page, perPage, id, type, res.locals.username);

    if (_.size(comments.docs) > 0 || comments.totalDocs > 0) {
      res.status(200).send({
        comments: comments.docs,
        page: comments.page,
        perPage: comments.limit,
        totalCount: comments.totalDocs,
        totalPages: comments.totalPages,
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
export const getMyComment: RequestHandler = async (req, res, next) => {
  try {
    const type = req.params?.sourceType;
    const id = req.params?.sourceId;

    const account = await Account.findOne().byName(res.locals.username).setOptions({ autopopulate: false }).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const comment = await Comment.findOne({ post: id, type: _.capitalize(type), 'author._id': account._id }).exec();
    if (!comment) return res.status(204).send();

    comment.author.image = account.image;

    res.status(200).send({ comment });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   CREATE
//---------------------
export const createComment: RequestHandler = async (req, res, next) => {
  try {
    const type = req.params?.sourceType;
    const id = req.params?.sourceId;

    const data = req.body?.data;

    const account = await Account.findOne().byName(res.locals.username).select('username image').exec();

    if (type === 'recipe') {
      const recipe = await Recipe.findById(id).exec();
      if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

      const dup = await Comment.findOne({ post: recipe._id, 'author._id': account._id }).lean().exec();
      if (dup) throw createRestAPIError('DUP_COMMENT');
    }

    if (type === 'snapshot') {
      const snapshot = await Snapshot.findById(id).exec();
      if (!snapshot) throw createRestAPIError('DOC_NOT_FOUND');

      const dup = await Comment.findOne({ post: snapshot._id, 'author._id': account._id }).lean().exec();
      if (dup) throw createRestAPIError('DUP_COMMENT');
    }

    data.author = { _id: account._id, username: account.username };
    data.type = _.capitalize(type);
    data.post = id;

    const comment = new Comment(data);

    await comment.save();
    comment.author.image = account.image;
    res.status(200).send({ comment });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   EDIT
//---------------------
export const editComment: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.commentId;

    const data = req.body?.data;

    const comment = await Comment.findById(id)
      .setOptions({ autopopulate: false })
      .populate({
        path: 'author',
        select: 'username image',
        options: { lean: true },
      })
      .exec();
    if (!comment) throw createRestAPIError('DOC_NOT_FOUND');
    if (comment.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    comment.set({
      comment: data.comment,
      rating: data.rating,
    });

    await comment.save();
    res.status(200).send({ comment });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   DELETE
//---------------------
export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.commentId;

    const comment = await Comment.findByIdAndDelete(id).exec();
    if (!comment) throw createRestAPIError('DOC_NOT_FOUND');
    if (comment.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
