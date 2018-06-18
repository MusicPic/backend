'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

describe('ACCOUNT ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('/login should return 200 and profile info from spotify', () => {
    return superagent.get(`${process.env.API_URL}/login`)
      .query('response_type=code')
      .query('client_id=965b3c6ca2634b57b85dc4e8966d8218')
      .query('scope=user-read-private%20user-read-email%20user-top-read%20user-library-read%20user-read-birthdate%20user-follow-read')
      .query('redirect_uri=http://localhost:3000/login')
      .then((response) => {
        return superagent.get('https://accounts.spotify.com/authorize/')
          .query(response.query)
          .then((res) => {
            expect(res.status).toEqual(200);
          });
      });
  });
});
