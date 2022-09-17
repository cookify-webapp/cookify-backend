import _ from 'lodash';
import { Types } from 'mongoose';

import { Notification } from '@models/notifications';
import { createCommentNotification, createFollowNotification } from '@config/notificationTemplate';

export const createNotification = async (
  type: 'complaint' | 'follow' | 'recipe' | 'snapshot' | 'comment',
  username: string,
  link: string,
  receiver: Types.ObjectId | null
) => {
  let caption = '';

  if (type === 'follow') {
    caption = createFollowNotification(username);

    const exist = await Notification.findOne({ receiver, type, link }).exec();
    if (exist) await exist.deleteOne();
  }

  if (type === 'recipe' || type === 'snapshot') {
    caption = createCommentNotification(type, [username]);

    const exist = await Notification.findOne({
      receiver,
      type: 'comment',
      link,
      read: false,
    }).exec();

    if (exist) {
      await exist.deleteOne();

      const oldUser = exist.caption.match(/(?<=<b>)(.*?)(?=<\/b>)/g);
      if (oldUser) caption = createCommentNotification(type, _.uniq([username, ...oldUser]));
    }

    type = 'comment';
  }

  const count = await Notification.find({ receiver }).count().exec();
  if (count === 30) await Notification.deleteOne({ receiver }).sort('createdAt').exec();

  const notification = new Notification({ type, caption, link, receiver });

  await notification.save();
};
