import createHttpError from 'http-errors';
import _ from 'lodash';

export const createCommentNotification = (type: 'recipe' | 'snapshot', username: string[]) => {
  let heading = _.map(username.slice(0, 3), (n) => `<b>${n}</b>`).join(', ');
  if (_.size(username) <= 3) {
    const lastIndex = heading.lastIndexOf(',');
    if (lastIndex >= 0) heading = heading.substring(0, lastIndex) + ' และ' + heading.substring(lastIndex + 1);
  }
  if (_.size(username) > 3) heading = heading + ' และคนอื่น ๆ';

  if (type === 'recipe') return `${heading} ได้แสดงความคิดเห็นบนสูตรอาหารของคุณ`;
  if (type === 'snapshot') return `${heading} ได้แสดงความคิดเห็นบน Snapshot ของคุณ`;

  throw createHttpError(500);
};

export const createFollowNotification = (username: string) => `<b>${username}</b> ได้ติดตามคุณ`;
