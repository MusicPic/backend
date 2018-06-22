'use strict';

import { startServer, stopServer } from '../lib/server';
import { removeProfileMock } from './lib/profile-mock';

describe('PICTURE SCHEMA', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  describe('POST /picture', () => {
    test('POST - should return a 404 status code if no account is passed.', () => {
    });
  });
});
