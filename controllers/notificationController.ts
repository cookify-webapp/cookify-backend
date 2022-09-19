import createRestAPIError from '@error/createRestAPIError';
import { RequestHandler } from 'express';

import { Account } from '@models/account';
import { Notification } from '@models/notifications';
import _ from 'lodash';

//---------------------
//   FETCH MANY
//---------------------
export const listNotification: RequestHandler = async (_req, res, next) => {
  try {
    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    await Notification.updateMany({ receiver: account._id }, { new: false }).exec();

    const notifications = await Notification.find({ receiver: account._id }).select('-new').sort('-createdAt').exec();
    if (!_.size(notifications)) res.status(204).send();

    res.status(200).send({ notifications });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   EDIT
//---------------------
export const readNotification: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.notificationId;

    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const result = await Notification.updateOne(
      { _id: id, receiver: account._id, new: false, read: false },
      { read: true }
    ).exec();
    if (result.matchedCount === 0) throw createRestAPIError('DOC_NOT_FOUND');

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const readAllNotification: RequestHandler = async (_req, res, next) => {
  try {
    const account = await Account.findOne().byName(res.locals.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    await Notification.updateMany({ receiver: account._id, new: false, read: false }, { read: true }).exec();

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
