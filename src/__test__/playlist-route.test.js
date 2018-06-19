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
      return createProfileMock()
        .then(() => {
          const token = process.env.SPOTIFY_OAUTH_TOKEN;
          console.log(token);
          return superagent.post(`${apiURL}/profile/playlist`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              searchTerm: 'happiness',
            })
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        })
        .catch((error) => {
          expect(error.status).toEqual(200);
        });
    });
  });
});
