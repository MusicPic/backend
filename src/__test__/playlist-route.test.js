'use strict';

import superagent from 'superagent';
import logger from '../lib/logger';
import { startServer, stopServer } from '../lib/server';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PLAYLIST SCHEMA', () => {
  beforeAll(startServer);
  afterEach(removeProfileMock);
  afterAll(stopServer);
  jest.setTimeout(10000);

  describe('POST /profile/playlist', () => {
    test('POST - should return a 200 status and create a playlist', () => {
      let accountMock = null;
      return createProfileMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;
          // console.log(accountMock);
          logger.log(logger.INFO, `ASM-token, ${accountSetMock.token}`);
          return superagent.post(`${apiURL}/profile/playlist`)
            .set('Authorization', `Bearer ${accountSetMock.token}`);
        })
        .then((response) => {
          console.log(response.body);
          // console.log(accountMock);
          // accountMock.profile = response.body;
          // console.log(accountMock);
          // logger.log(logger.INFO, JSON.stringify(response.body.playlist));
          // accountMock.playlist = response.body.profile.playlist;
          expect(response.status).toEqual(200);
          // expect(response.body.playlist.profile).toEqual(accountMock.profile._id.toString());
          // expect(response.body.playlist.playlistName).toEqual(accountMock.)
        });
    });
  });
});
