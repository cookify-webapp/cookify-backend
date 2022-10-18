import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import _ from 'lodash';

import { Account } from '@models/account';
import { Recipe } from '@models/recipe';

import createRestAPIError from '@error/createRestAPIError';
import { deleteImage, generateFileName, uploadImage } from '@utils/imageUtil';
import { sendAdminConfirmation, sendAdminRevocation } from '@services/mailService';
import { includesId } from '@utils/includesIdUtil';
import { Notification } from '@models/notifications';
import { createFollowNotification } from '@functions/notificationFunction';

//---------------------
//   FETCH MANY
//---------------------
export const getAdmins: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;

    const accounts = await Account.paginate(
      {
        accountType: 'admin',
        $or: [{ username: { $regex: searchWord, $options: 'i' } }, { email: { $regex: searchWord, $options: 'i' } }],
      },
      { page: page, limit: perPage, select: 'image username email', sort: 'username', lean: true, leanWithId: false }
    );

    if (_.size(accounts.docs) > 0 || accounts.totalDocs > 0) {
      res.status(200).send({
        accounts: accounts.docs,
        page: accounts.page,
        perPage: accounts.limit,
        totalCount: accounts.totalDocs,
        totalPages: accounts.totalPages,
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};

export const getFollowing: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.userId;

    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);

    const account = await Account.findById(id)
      .select('following')
      .populate('following', 'image username email')
      .sort('username')
      .lean()
      .exec();

    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const following = account.following?.slice(perPage * (page - 1), perPage * page);

    if (_.size(account.following) > 0) {
      res.status(200).send({
        following: following,
        page: page,
        perPage: perPage,
        totalCount: _.size(account.following),
        totalPages: Math.ceil(_.size(account.following) / perPage),
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};

export const getFollower: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.userId;

    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);

    const accounts = await Account.paginate(
      { following: id },
      { page: page, limit: perPage, select: 'image username email', sort: 'username', lean: true, leanWithId: false }
    );

    if (_.size(accounts.docs) > 0 || accounts.totalDocs > 0) {
      res.status(200).send({
        follower: accounts.docs,
        page: accounts.page,
        perPage: accounts.limit,
        totalCount: accounts.totalDocs,
        totalPages: accounts.totalPages,
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};

export const listPending: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);

    const accounts = await Account.paginate(
      { accountType: 'pending' },
      {
        page: page,
        limit: perPage,
        projection: { _id: 0, email: 1, uniqueKey: '$username' },
        sort: 'email',
        lean: true,
        leanWithId: false,
      }
    );

    if (_.size(accounts.docs) > 0 || accounts.totalDocs > 0) {
      res.status(200).send({
        accounts: accounts.docs,
        page: accounts.page,
        perPage: accounts.limit,
        totalCount: accounts.totalDocs,
        totalPages: accounts.totalPages,
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
export const login: RequestHandler = async (req, res, next) => {
  try {
    const username = req.body?.data?.username;
    const password = req.body?.data?.password;

    const secret = process.env.JWT_SECRET;
    if (!secret) throw createRestAPIError('MISSING_SECRET');

    const account = await Account.findOne().byName(username).select('username password accountType').exec();
    if (!account || account.accountType === 'pending') throw createRestAPIError('WRONG_USERNAME');

    const result = await account.comparePassword(password);
    if (!result) throw createRestAPIError('WRONG_PASSWORD');

    const token = account.signToken(secret);
    res.status(200).send({ token });
  } catch (err) {
    return next(err);
  }
};

export const getMe: RequestHandler = async (_req, res, next) => {
  try {
    const account = await Account.findOne()
      .byName(res.locals.username)
      .select('username email accountType image bookmark allergy following')
      .populate('allergy', 'name type image')
      .lean({ autopopulate: true })
      .exec();

    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const followingCount = _.size(account.following);
    const followerCount = await Account.find({ following: account._id }).select('username').lean().count().exec();

    delete account.following;

    res.status(200).send({ account, followingCount, followerCount });
  } catch (err) {
    return next(err);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.userId;

    const account = await Account.findById(id).select('username email accountType image following').lean().exec();

    const self = res.locals.username
      ? await Account.findOne().byName(res.locals.username).select('following').exec()
      : null;

    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const followingCount = _.size(account.following);
    const followerCount = await Account.find({ following: account._id }).select('username').lean().count().exec();
    const isFollowing = includesId(self?.following, account._id);

    delete account.following;

    res.status(200).send({ account, followingCount, followerCount, isFollowing });
  } catch (err) {
    return next(err);
  }
};

export const verifyPending: RequestHandler = async (req, res, next) => {
  try {
    const uniqueKey = req.params?.uniqueKey;

    const account = await Account.findOne().byName(uniqueKey).exec();
    if (!account || account.accountType !== 'pending') throw createRestAPIError('ACCOUNT_NOT_FOUND');

    res.status(200).send({ email: account?.email });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   CREATE
//---------------------
export const register: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body.data;

    const account = new Account(data);
    await account.hashPassword();

    await account.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const addPending: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body.data;

    const account = new Account({
      username: new Types.ObjectId().toString(),
      email: data?.email,
      accountType: 'pending',
    });

    await account.save();
    await sendAdminConfirmation(account.email, account.username);
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   EDIT
//---------------------
export const setBookmark: RequestHandler = async (req, res, next) => {
  try {
    const account = await Account.findOne().byName(res.locals.username).setOptions({ autopopulate: false }).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const id = req.params?.recipeId;

    const recipe = await Recipe.findById(id).exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

    account.bookmark[includesId(account.bookmark, recipe._id) ? 'pull' : 'push'](recipe._id);

    await account.save({ validateModifiedOnly: true });
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const setFollow: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.userId;

    const account = await Account.findOne().byName(res.locals.username).setOptions({ autopopulate: false }).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const target = await Account.findById(id).setOptions({ autopopulate: false }).exec();
    if (!target) throw createRestAPIError('DOC_NOT_FOUND');
    if (target.id === account.id) throw createRestAPIError('FOLLOW_SELF');

    const exist = includesId(account.following, target._id);

    account.following?.[exist ? 'pull' : 'push'](target._id);

    await account.save({ validateModifiedOnly: true });

    !exist && (await createFollowNotification(account.username, `/users/${account.id}`, target.id));
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const editProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body?.data;

    const account = await Account.findOne().byName(res.locals.username).setOptions({ autopopulate: false }).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const imageName = account.imageName || (req.file ? generateFileName(req.file?.originalname) : '');

    account.set({
      email: data?.email,
      allergy: data?.allergy,
      imageName,
      image: req.file ? await uploadImage('accounts', imageName, req.file) : account.image,
    });

    await account.save({ validateModifiedOnly: true });
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const registerAdmin: RequestHandler = async (req, res, next) => {
  try {
    const uniqueKey = req.params?.uniqueKey;
    const data = req.body.data;

    const account = await Account.findOne().byName(uniqueKey).exec();
    if (!account || account.accountType !== 'pending') throw createRestAPIError('ACCOUNT_NOT_FOUND');

    account.set({
      username: data?.username,
      email: data?.email || account.email,
      password: data?.password,
      allergy: data?.allergy,
      accountType: 'admin',
    });
    await account.hashPassword();

    await account.save({ validateModifiedOnly: true });
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   DELETE
//---------------------
export const deleteProfile: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.userId;

    const account = await Account.findByIdAndDelete(id).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    await Notification.deleteMany({ receiver: account.id }).exec();

    account.image && (await deleteImage('accounts', account.imageName));
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const revokeRequest: RequestHandler = async (req, res, next) => {
  try {
    const email = req.params?.email;

    const account = await Account.findOne({ email }).exec();
    if (!account || account.accountType !== 'pending') throw createRestAPIError('ACCOUNT_NOT_FOUND');

    await account.deleteOne();
    await sendAdminRevocation(account.email);
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
