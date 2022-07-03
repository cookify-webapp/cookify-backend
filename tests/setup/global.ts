import * as db from '@tests/support/db';

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.clearCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});