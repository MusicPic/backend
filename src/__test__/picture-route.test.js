'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createProfileMock, removeProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PICTURE SCHEMA', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  describe('POST /picture', () => {
    test('POST - should return a 200 status code and the newly created picture.', () => {
      let accountMock = null;
      return createProfileMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;
          return superagent.post(`${apiURL}/picture`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              url: 'https://i.imgflip.com/vh6to.jpg',
              account: accountSetMock.account._id,
            });
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
        });
    });
  });
});
