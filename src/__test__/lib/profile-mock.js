'use strict';

import faker from 'faker';
import Profile from '../../models/profile';
import { createAccountMock } from './account-mock';

const createProfileMock = () => {
  const resultMock = {};

  return createAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;
      return new Profile({
        username: faker.name.word(),
        avatar: faker.random.image(),
        account: accountSetMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

// const removeProfileMock = () => {
//   return Promise.all([
//     Profile.remove({}),
//     removeAccountMock(),
//   ]);
// };

export default { createProfileMock };
