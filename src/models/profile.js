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
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

const Profile = mongoose.model('profile', profileSchema);

export default Profile;
