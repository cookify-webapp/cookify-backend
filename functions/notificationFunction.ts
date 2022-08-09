import _ from 'lodash';
import { Types } from 'mongoose';

import { Notification } from '@models/notifications';

export const createNotification = async (detail: {
  type: 'complaint' | 'follow' | 'comment';
  caption: string;
  link: string;
  receiver: Types.ObjectId | null;
}) => {
  const count = await Notification.find({ receiver: detail.receiver }).count().exec();
  if (count >= 30) await Notification.deleteOne({ receiver: detail.receiver }).sort('-createdAt').exec();

  const notification = new Notification(detail);

  await notification.save();
};
