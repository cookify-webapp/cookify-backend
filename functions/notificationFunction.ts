import _ from 'lodash';
import { AggregatePaginateResult, Types } from 'mongoose';

import { Notification, NotificationInstanceInterface, NotificationModelInterface } from '@models/notifications';
import {
  createComplaintNotificationTemplate,
  createCommentNotificationTemplate,
  createFollowNotificationTemplate,
} from '@config/notificationTemplate';
import { ComplaintStatus } from '@models/complaints';

const saveNotification = async (
  type: string,
  caption: string,
  link: string,
  receiver: string | Types.ObjectId | null
) => {
  const count = await Notification.find({ receiver }).count().exec();
  if (count === 30) await Notification.deleteOne({ receiver }).sort('createdAt').exec();

  const notification = new Notification({ type, caption, link, receiver });

  await notification.save();
};

export const createFollowNotification = async (username: string, link: string, receiver: Types.ObjectId | null) => {
  const exist = await Notification.findOne({ receiver, type: 'follow', link }).exec();
  if (exist) await exist.deleteOne();

  await saveNotification('follow', createFollowNotificationTemplate(username), link, receiver);
};

export const createCommentNotification = async (
  type: 'recipe' | 'snapshot',
  username: string,
  link: string,
  receiver: Types.ObjectId | null
) => {
  let caption = createCommentNotificationTemplate(type, [username]);

  const exist = await Notification.findOne({
    receiver,
    type: 'comment',
    link,
    read: false,
  }).exec();

  if (exist) {
    await exist.deleteOne();

    const oldUser = exist.caption.match(/(?<=<b>)(.*?)(?=<\/b>)/g);
    if (oldUser) caption = createCommentNotificationTemplate(type, _.uniq([username, ...oldUser]));
  }

  await saveNotification('comment', caption, link, receiver);
};

export const createComplaintNotification = async (
  type: 'recipe' | 'snapshot',
  status: ComplaintStatus,
  link: string,
  receiver: string | Types.ObjectId | null
) => await saveNotification('complaint', createComplaintNotificationTemplate(type, status), link, receiver);
