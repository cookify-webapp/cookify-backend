import { RequestHandler } from 'express';
import _ from 'lodash';

import { Comment } from '@models/comment';
import { Account } from '@models/account';
import createRestAPIError from '@error/createRestAPIError';
import { Recipe } from '@models/recipe';
import { Snapshot } from '@models/snapshot';

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

export const createComment: RequestHandler = async (req, res, next) => {
  try {
    const type = req.params?.sourceType;
    const id = req.params?.sourceId;

    const data = req.body?.data;

    if (type === 'recipe') {
      const recipe = await Recipe.findById(id).exec();
      if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');
    }

    if (type === 'snapshot') {
      const snapshot = await Snapshot.findById(id).exec();
      if (!snapshot) throw createRestAPIError('DOC_NOT_FOUND');
    }

    const account = await Account.findOne().byName(res.locals.username).select('username').exec();

    data.author = account._id;
    data.type = _.capitalize(type);
    data.post = id;

    const comment = new Comment(data);

    await comment.save();
    await comment.populate({
      path: 'author',
      select: 'username image',
      options: { lean: true },
    });
    res.status(200).send({ comment });
  } catch (err) {
    return next(err);
  }
};

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

export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.commentId;

    const comment = await Comment.findById(id).exec();
    if (!comment) throw createRestAPIError('DOC_NOT_FOUND');
    if (comment.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    await comment.deleteOne();

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
