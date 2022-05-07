import { beforeAll, afterEach, afterAll } from '@jest/globals';

import * as db from '@tests/support/db';

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});