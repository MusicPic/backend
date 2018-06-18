'use strict';

import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  spotifyId: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
});

const Account = mongoose.model('account', accountSchema);

Account.create = (username, email, spotifyId, accessToken) => {
  return new Account({
    username,
    email,
    spotifyId,
    accessToken,
  }).save();
};

export default Account;
