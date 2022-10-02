jest.mock('fs');

import fs from 'fs';
import path from 'path';

import imageUtil from '@utils/imageUtil';

describe('Image Utility', () => {
  beforeAll(() => {
    (fs as any).__setMockFiles({
      [path.resolve(process.cwd(), 'public', 'images', 'test', 'image.jpg')]: 'whatever',
    });
  });

  it('should be a multer object', () => {
    expect(typeof imageUtil).toEqual('object');
  });

  it('should return a middleware function', () => {
    expect(typeof imageUtil.single('')).toEqual('function');
  });
});
