import _ from 'lodash';
import { Types } from 'mongoose';

export const includesId = (arr: Types.ObjectId[] | null | undefined, target: Types.ObjectId) => {
  return _.some(arr, (item) => item.equals(target));
};
