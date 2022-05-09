import { jest } from '@jest/globals';
import _ from 'lodash';
import path from 'path';

const fs = jest.createMockFromModule('fs') as any;

let mockFiles = Object.create(null);

const traverse = (dir: string) => {
  const dirArr = dir.split(/[\\\/]/);
  let tmp = mockFiles;
  _.forEach(dirArr, (item) => {
    tmp = tmp[item];
  });
  return tmp;
};

fs.__setMockFiles = (newMockFiles: { [key: string]: string }) => {
  mockFiles = Object.create(null);
  _.forIn(newMockFiles, (_data, file) => {
    const dir = path.dirname(file);
    const dirArr = dir.split(/[\\\/]/);
    _.reduce(
      dirArr,
      (prev, curr, index) => {
        if (index === _.size(dirArr) - 1) {
          prev[curr] = prev[curr] || [];
          return prev[curr].push(path.basename(file));
        } else {
          prev[curr] = prev[curr] || {};
          return prev[curr];
        }
      },
      mockFiles
    );
  });
};

fs.existsSync = (dir: string) => _.has(mockFiles, dir);

fs.mkdirSync = (dir: string) => (mockFiles[dir] = []);

fs.unlinkSync = (file: string) => {
  const dir = path.dirname(file);
  const dirArr = dir.split(/[\\\/]/);
  const lastDir = dirArr[_.size(dirArr) - 1];
  dirArr.pop();
  const newDir = dirArr.join('\\');
  _.pull(traverse(newDir)[lastDir], path.basename(file));
};

fs.readdirSync = (dir: string) => traverse(dir) || [];

export default fs;
