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

    const notifications = await Notification.find({ receiver: account._id }).sort('-createdAt').exec();
    if (!_.size(notifications)) res.status(204).send();

    res.status(200).send({ notifications });
  } catch (err) {
    return next(err);
  }
};
