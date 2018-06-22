'use strict';

import mongoose from 'mongoose';

const playlistSchema = mongoose.Schema({
  playlistName: {
    type: String,
  },
  image: {
    type: String,
  },
  playlistId: {
    type: String,
    required: true,
  },
  playlistUrl: {
    type: String,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
    required: true,
  },
});

const Playlist = mongoose.model('playlist', playlistSchema);

export default Playlist;
