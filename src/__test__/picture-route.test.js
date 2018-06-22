'use strict';

// import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeProfileMock } from './lib/profile-mock';

// const apiURL = `http://localhost:${process.env.PORT}`;

describe('PICTURE SCHEMA', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  describe('POST /picture', () => {
    test('POST - should return a 200 status code and the newly created picture.', () => {
    });
  });
});
