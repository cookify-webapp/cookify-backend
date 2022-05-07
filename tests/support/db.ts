import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import _ from 'lodash';

let mongo: MongoMemoryServer | undefined = undefined;

export const setUp = async () => {
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();
  await mongoose.connect(url);
};

export const dropDatabase = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

export const dropCollections = async () => {
  if (mongo) {
    const collections = mongoose.connection.collections;
    _.forIn(collections, async (_item, key) => {
      const collection = collections[key];
      await collection.deleteMany({});
    });
  }
};