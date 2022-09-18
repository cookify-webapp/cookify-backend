import { ComplaintStatus } from '@models/complaints';
import createHttpError from 'http-errors';
import _ from 'lodash';

export const createCommentNotificationTemplate = (type: 'recipe' | 'snapshot', username: string[]) => {
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

export const createFollowNotificationTemplate = (username: string) => `<b>${username}</b> ได้ติดตามคุณ`;

export const createComplaintNotificationTemplate = (type: 'recipe' | 'snapshot', status: ComplaintStatus) => {
  const heading = type === 'recipe' ? 'สูตรอาหาร' : ' Snapshot ';

  if (status === ComplaintStatus.IN_PROGRESS)
    return `<b>คุณมี${heading}ที่ถูกรายงาน</b> ระบบจะจำกัดการมองเห็นจนกว่าจะได้รับการแก้ไข`;
  if (status === ComplaintStatus.COMPLETED) return `${heading}ของคุณผ่านการตรวจสอบและเป็นสาธารณะแล้ว`.trim();

  throw createHttpError(500);
};

export const createReviewNotificationTemplate = (
  type: 'recipe' | 'snapshot',
  username: string,
  status: ComplaintStatus
) => {
  const heading = type === 'recipe' ? 'สูตรอาหาร' : ' Snapshot ';

  if (status === ComplaintStatus.VERIFYING)
    return `<b>${username}</b> ได้ทำการแก้ไข${heading}ที่ถูกร้องเรียนแล้ว โปรดทำการตรวจสอบ`;
  if (status === ComplaintStatus.DELETED) return `<b>${username}</b> ได้ทำการลบ${heading}ที่ถูกร้องเรียนแล้ว`;

  throw createHttpError(500);
};
