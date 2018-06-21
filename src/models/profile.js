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
  picture: [{
    type: String,
  }],
  playlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'playlist',
    },
  ],
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
}, { usePushEach: true });

const Profile = mongoose.model('profile', profileSchema);

Profile.create = (username, account) => {
  return new Profile({
    username, account,
  }).save();
};

export default Profile;
