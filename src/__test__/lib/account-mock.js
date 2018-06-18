'use strict';

import faker from 'faker';
import Account from '../../models/account';

const createAccountMock = () => {
  const mock = {};
  mock.request = {
    username: faker.lorem.word(),
    email: faker.internet.email(),
    spotifyId: faker.internet.ip(),
    accessToken: faker.lorem.word(),

  };
  return Account.create(mock.request.username, mock.request.email, mock.request.spotifyId, mock.request.accessToken)
    .then((account) => {
      mock.account = account;
      return account.accessToken;
    })
    .then((accessToken) => {
      mock.accessToken = accessToken;
      return Account.findById(mock.account._id);
    })
    .then((account) => {
      mock.account = account;
      return mock;
    });
};

const removeAccountMock = () => Account.remove({});

export { createAccountMock, removeAccountMock };
