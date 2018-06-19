'use strict';

import faker from 'faker';
import Profile from '../../models/profile';
import { createAccountMock, removeAccountMock } from './account-mock';

const createProfileMock = () => {
  let resultMock = {};

  return createAccountMock()
    .then((accountSetMock) => {
      resultMock = accountSetMock;
      // console.log(resultMock.accountSetMock.account._id);

      return new Profile({
        username: faker.name.firstName(),
        avatar: faker.internet.url(),
        account: resultMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      // console.log(resultMock);
      return resultMock;
    });
};

const removeProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    removeAccountMock(),
  ]);
};

export { createProfileMock, removeProfileMock };
