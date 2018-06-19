'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PLAYLIST SCHEMA', () => {
  beforeAll(startServer);
  afterEach(removeProfileMock);
  afterAll(stopServer);

  describe('POST /profile/playlist', () => {
    test('POST - should return a 200 status and create a playlist', () => {
      let accountMock = null;
      return createProfileMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;
          console.log('ASM-token', accountSetMock.token);
          return superagent.post(`${apiURL}/profile/playlist`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              searchTerm: 'sad',
              account: accountSetMock.account._id,
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
        })
        .catch((error) => {
          expect(error.status).toEqual(200);
        });
    });
  });
});
