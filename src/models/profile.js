'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
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

// Profile.addplaylist

const Profile = mongoose.model('profile', profileSchema);

export default Profile;
