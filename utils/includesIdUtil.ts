import _ from 'lodash';
import { Types } from 'mongoose';

export const includesId = (arr: Types.ObjectId[], target: Types.ObjectId) => {
  return _.some(arr, (item) => item.equals(target));
};
