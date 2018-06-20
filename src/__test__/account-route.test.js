'use strict';

import { startServer, stopServer } from '../lib/server';

describe('ACCOUNT ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('/login should return 200 and profile info from spotify', () => {
  });
});
