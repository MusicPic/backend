'use strict';

import superagent from 'superagent';
import logger from '../lib/logger';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PROFILE SCHEMA', () => {
  beforeAll(startServer);
  afterEach(removeProfileMock);
  afterAll(stopServer);

  describe('POST /profile', () => {
    test('POST - should return a 200 status code and the newly created profile.', () => {
      let accountMock = null;
      return createAccountMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;
          logger.log(logger.INFO, 'test');
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              username: 'test',
              account: accountSetMock.account._id,
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual('test');
          expect(response.body.account).toEqual(accountMock.account._id.toString());
        });
    });

    test('POST - should return a 400 status code if there were missing required values.', () => {
      return createAccountMock()
        .then((accountSetMock) => {
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              username: 'Sarah',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });

    test('POST - should return a 401 for an invalid token.', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', 'Bearer 1234')
            .send({
              username: 'Kris',
              account: mock.account._id,
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });

    test('POST - should return a 404 for a bad route.', () => {
      let accountMock = null;

      return createAccountMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;

          return superagent.post(`${apiURL}/badroute`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              username: 'Blanka',
              account: accountMock.account._id,
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    
    test('POST - should return a 409 status code if there are duplicate unique key values.', () => {
      let mock = {};

      return createProfileMock()
        .then((accountSetMock) => {
          mock = accountSetMock;

          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({
              username: 'David',
              account: mock.account._id,
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(409);
        });
    });
  });

  describe('GET /profile', () => { 
    test('GET - should return a 200 status code and profile', () => {
      let profileMock = null;

      return createProfileMock()
        .then((profileSetMock) => {
          profileMock = profileSetMock;

          return superagent.get(`${apiURL}/profile/me`)
            .set('Authorization', `Bearer ${profileMock.token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.profile.username).toEqual(profileMock.profile.username);
              expect(response.body.profile.avatar).toEqual(profileMock.profile.avatar);
              expect(response.body.profile.account).toEqual(profileMock.profile.account.toString());
            });
        });
    });


    test('GET - should return a 400 for no token being passed.', () => {
      let profileMock = null;

      return createProfileMock()
        .then((profileSetMock) => {
          profileMock = profileSetMock;

          return superagent.get(`${apiURL}/profile/${profileMock.profile._id}`)
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });

    test('GET - should return a 401 for an invalid token.', () => {
      let profileMock = null;

      return createProfileMock()
        .then((profileSetMock) => {
          profileMock = profileSetMock;

          return superagent.get(`${apiURL}/profile/${profileMock.profile._id}`)
            .set('Authorization', 'Bearer 1234')
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(401);
            });
        });
    });

    test('GET - should return a 404 for an invalid id', () => {
      let profileMock = null;

      return createProfileMock()
        .then((setProfleMock) => {
          profileMock = setProfleMock;

          return superagent.get(`${apiURL}/profile/badID`)
            .set('Authorization', `Bearer ${profileMock.token}`)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
  });


  describe('PUT /profile', () => {
    test('PUT - should return a 200 status code if successful.', () => {
      let profileToUpdate = null;

      return createProfileMock()
        .then((profile) => {
          profileToUpdate = profile;

          return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
            .set('Authorization', `Bearer ${profileToUpdate.token}`)
            .send({
              username: 'test',
              avatar: 'avatar_string',
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual('test');
          expect(response.body.account).toEqual(profileToUpdate.profile.account.toString());
          expect(response.body._id).toEqual(profileToUpdate.profile._id.toString());
        });
    });
  });

  test('PUT - should return a 400 status code for no token being passed.', () => {
    let profileToUpdate = null;

    return createProfileMock()
      .then((profile) => {
        profileToUpdate = profile;

        return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
          .send({
            firstName: 'test',
            account: '1234',
          });
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });

  test('PUT - should return a 401 status code for an invalid token being passed.', () => {
    let profileToUpdate = null;

    return createProfileMock()
      .then((profile) => {
        profileToUpdate = profile;

        return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
          .set('Authorization', 'Bearer invalidToken')
          .send({
            firstName: 'test',
            account: '1234',
          });
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(401);
      });
  });

  test('PUT - should return a 404 status code for a bad id being passed.', () => {
    let profileToUpdate = null;

    return createProfileMock()
      .then((profile) => {
        profileToUpdate = profile;

        return superagent.put(`${apiURL}/profile/badID`)
          .set('Authorization', `Bearer ${profileToUpdate.token}`)
          .send({
            username: 'test',
          });
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(404);
      });
  });

  test('PUT - should return a 409 status code for duplicate unique keys.', () => {
    let mock = {};
    let mock2 = {};

    return createAccountMock()
      .then((account1) => {
        mock = account1;

        return superagent.post(`${apiURL}/profile`)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            username: 'Joanna',
            account: mock.account._id,
          });
      })
      .then(() => {
        return createProfileMock()
          .then((account2) => {
            mock2 = account2;

            return superagent.put(`${apiURL}/profile/${mock2.profile._id}`)
              .set('Authorization', `Bearer ${mock2.token}`)
              .send({ username: 'Joanna' });
          })
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(409);
          });
      });
  });

  describe('DELETE /profile', () => {
    test('DELETE - Should return 204 for deleted profile', () => {
      let deleteProfileMock = null;

      return createProfileMock()
        .then((profileToDelete) => {
          deleteProfileMock = profileToDelete;
          return superagent.delete(`${apiURL}/profile/${deleteProfileMock.profile._id}`)
            .set('Authorization', `Bearer ${deleteProfileMock.token}`)
            .then((response) => {
              expect(response.status).toEqual(204);
            });
        });
    });

    test('DELETE - should return 400 if not authorized', () => {
      let deleteProfileMock = null;

      return createProfileMock()
        .then((profileToDelete) => {
          deleteProfileMock = profileToDelete;
          return superagent.delete(`${apiURL}/profile/${deleteProfileMock.profile._id}`)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });

    test('DELETE - should respond with 404 if no profile found', () => {
      return createAccountMock()
        .then((account) => {
          return superagent.delete(`${apiURL}/profile/BadId`)
            .set('Authorization', `Bearer ${account.token}`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(404);
            });
        });
    });
  });
});

