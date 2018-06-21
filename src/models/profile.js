'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  username: {
    type: String,
    // required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  pictures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'picture',
    },
  ],
  playlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'playlist',
    },
  ],
  accessToken: { 
    type: String,
  },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
}, { usePushEach: true });

const Profile = mongoose.model('profile', profileSchema);

Profile.create = (username, account, accessToken) => {
  return new Profile({
    username, account, accessToken,
  }).save();
};

export default Profile;
