'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128; 

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    // required: true,
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
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
});

function verifyAccessToken(accessToken) {
  return bcrypt.compare(accessToken, this.accessToken)
    .then((result) => {
      if (!result) {
        throw new HttpError(400, 'AUTH - incorrect data.');
      }
      return this;
    });
}
function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      return jsonWebToken.sign({ tokenSeed: account.tokenSeed }, process.env.TOKEN_SECRET);
    });
}
accountSchema.methods.verifyAccessToken = verifyAccessToken;
accountSchema.methods.pCreateToken = pCreateToken;

const Account = mongoose.model('account', accountSchema);

Account.create = (username, email, spotifyId, accessToken) => {
  return bcrypt.hash(accessToken, HASH_ROUNDS)
    .then((accessTokenHash) => {
      console.log(accessTokenHash);
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        spotifyId,
        accessToken,
        tokenSeed,
      }).save();
    });
};

export default Account;
