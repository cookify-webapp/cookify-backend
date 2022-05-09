jest.mock('fs');

import { jest, describe, it, expect, beforeAll } from '@jest/globals';

import fs from 'fs';
import path from 'path';

import imageUtil, { deleteImage } from '@utils/imageUtil';

describe('Image Utility', () => {
  beforeAll(() => {
    (fs as any).__setMockFiles({
      [path.resolve(process.cwd(), 'public', 'images', 'test', 'image.jpg')]: 'whatever',
    });
  });

  it('should be a middleware function', () => {
    expect(typeof imageUtil.single('')).toEqual('function');
  });

  it('should delete the image correctly', () => {
    const dir = path.resolve(process.cwd(), 'public', 'images', 'test');
    expect(fs.readdirSync(dir)).toEqual(['image.jpg']);
    
    expect(() => deleteImage('test', 'image.jpg')).not.toThrow();
    expect(fs.readdirSync(dir)).toEqual([]);
  });
});
