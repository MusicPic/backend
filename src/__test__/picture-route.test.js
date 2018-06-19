'use strict';

// import superagent from 'superagent';
import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/account-mock';
// import { createProfileMock, removeProfileMock } from './lib/profile-mock';

// import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PICTURE SCHEMA', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  describe('POST /picture', () => {
    test('POST - should return a 200 status code and the newly created picture.', () => {
      let accountMock = null;
      return createAccountMock()
        .then((accountSetMock) => {
          console.log('WHAT TO GET', accountSetMock.token);
          accountMock = accountSetMock;
          return superagent.post(`${apiURL}/picture`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              url: 'https://i.imgflip.com/vh6to.jpg',
              account: accountSetMock.account._id,
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
        })
        .catch((err) => {
          console.log('ERROR IS WHAT', err);
        });
    });
  });
});
