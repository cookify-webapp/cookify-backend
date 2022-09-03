import createHttpError from 'http-errors';
import _ from 'lodash';

export const createCommentNotification = (type: 'recipe' | 'snapshot', username: string[]) => {
  let heading = _.map(username.slice(0, 3), (n) => `<b>${n}</b>`).join(', ');
  if (_.size(username) > 3) heading = heading + `และอีก ${_.size(username) - 3} คน`;

  if (type === 'recipe') return `${heading} ได้แสดงความคิดเห็นบนสูตรอาหารของคุณ`;
  if (type === 'snapshot') return `${heading} ได้แสดงความคิดเห็นบน Snapshot ของคุณ`;

  throw createHttpError(500);
};

export const createFollowNotification = (username: string) => `<b>${username}</b> ได้ติดตามคุณ`;
