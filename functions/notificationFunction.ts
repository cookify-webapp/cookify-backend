import _ from 'lodash';
import { Types } from 'mongoose';

import { Notification } from '@models/notifications';
import { createCommentNotification } from '@config/notificationTemplate';

export const createNotification = async (detail: {
  type: 'complaint' | 'follow' | 'comment';
  caption: string;
  link: string;
  receiver: Types.ObjectId | null;
}) => {
  if (detail.type === 'follow') {
    const exist = await Notification.findOne({ receiver: detail.receiver, type: 'follow', link: detail.link }).exec();
    if (exist) await exist.deleteOne();
  }

  if (detail.type === 'comment') {
    const exist = await Notification.findOne({
      receiver: detail.receiver,
      type: 'comment',
      link: detail.link,
      read: false,
    }).exec();
    if (exist) {
      await exist.deleteOne();

      const newUser = detail.caption.match(/(?<=<b>)(.*?)(?=<\/b>)/);
      const oldUser = exist.caption.match(/(?<=<b>)(.*?)(?=<\/b>)/);
      const commentType =
        exist.caption.match(/(?<=ได้แสดงความคิดเห็นบน)(.*?)(?=ของคุณ)/)?.[0] === 'สูตรอาหาร' ? 'recipe' : 'snapshot';
      if (newUser && oldUser && commentType)
        detail.caption = createCommentNotification(commentType, _.uniq([...newUser, ...oldUser]));
    }
  }

  const count = await Notification.find({ receiver: detail.receiver }).count().exec();
  if (count === 30) await Notification.deleteOne({ receiver: detail.receiver }).sort('createdAt').exec();

  const notification = new Notification(detail);

  await notification.save();
};
