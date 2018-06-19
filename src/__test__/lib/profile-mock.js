'use strict';

import faker from 'faker';
import Profile from '../../models/profile';
import { createAccountMock, removeAccountMock } from './account-mock';

const createProfileMock = () => {
  const resultMock = {};

  return createAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;
      return new Profile({
        username: faker.name.word(),
        avatar: faker.internet.url(),
        account: accountSetMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const removeProfileMock = () => {
  console.log('REMOVING PROFILE?');
  return Promise.all([
    Profile.remove({}),
    removeAccountMock(),
  ]);
};

export default { createProfileMock, removeProfileMock };
