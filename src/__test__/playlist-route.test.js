'use strict';

import superagent from 'superagent';
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
          return superagent.post(`${apiURL}/profile/playlist`)
            .set('Authorization', `Bearer ${accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.profile._id).toEqual(accountMock.profile._id.toString());
          expect(response.body.profile.username).toEqual(accountMock.profile.username);
          expect(response.body.profile.playlists).toBeInstanceOf(Array);
        })
        .catch((error) => {
          console.log('Error______', error);
        });
    });
    //     test('POST - should return a error status when failing to create a playlist', () => {
    //       let accountMock = null;
    //       return createProfileMock()
    //         .then((accountSetMock) => {
    //           accountMock = accountSetMock;
    //           return superagent.post(`${apiURL}/profile/playlist`)
    //             .set('Authorization', `Bearer ${accountMock.token}`);
    //         })
    //         .then((response) => {
    //           logger.log(logger.INFO, `ASM2-----------, ${(accountMock.profile)}`);
    //           console.log('test response2_______', response.body.profile);
    //           expect(response.status).toEqual(200);
    //           expect(response.body.profile._id).toEqual(accountMock.profile._id.toString());
    //           expect(response.body.profile.username).toEqual(accountMock.profile.username);
    //           expect(response.body.profile.playlists).toBeInstanceOf(Array);
    //         })
    //         .catch((error) => {
    //           console.log('Error______', error);
    //         });
    //     });
  });
});
