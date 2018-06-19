'use strict';

// import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

// const apiURL = `http://localhost:${process.env.PORT}`;

describe('ACCOUNT ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('/login should return 200 and profile info from spotify', () => {
    // return superagent.get(`${apiURL}/login`)
    //   .then((response) => {
    //     expect(response.statues).toEqual(200);
    //     return superagent.get('https://accounts.spotify.com/authorize/')
    //       .query(response.query)
    //       .then((res) => {
    //         expect(res.status).toEqual(200);
    //       });
    //   });
  });
});
