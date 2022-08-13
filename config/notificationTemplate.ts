import createHttpError from 'http-errors';

export const createCommentNotification = (type: 'recipe' | 'snapshot', username: string) => {
  if (type === 'recipe') return `<b>${username}</b> ได้แสดงความคิดเห็นบนสูตรอาหารของคุณ`;
  if (type === 'snapshot') return `<b>${username}</b> ได้แสดงความคิดเห็นบน Snapshot ของคุณ`;
  throw createHttpError(500);
};

export const createFollowNotification = (username: string) => `<b>${username}</b> ได้ติดตามคุณ`;
