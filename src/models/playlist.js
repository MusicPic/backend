'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Profile from './profile';

const playlistSchema = mongoose.Schema({
  playlistName: {
    type: String,
  },
  image: {
    type: String,
    // required: true,
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

function playlistPreHook(done) {
  return Profile.findById(this.profile)
    .then((profileFound) => {
      if (!profileFound) {
        throw new HttpError(404, 'Profile not found.');
      }
      profileFound.playlists.push(this._id);
      return profileFound.save();
    })
    .then(() => done());
}

const playlistPostHook = (document, done) => {
  return Profile.findById(document.profile)
    .then((profileFound) => {
      if (!profileFound) {
        throw new HttpError(500, 'Profile not found in post hook.');
      }
      profileFound.playlists = profileFound.playlists.filter((playlistId) => {
        return playlistId.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

playlistSchema.pre('save', playlistPreHook);
playlistSchema.post('remove', playlistPostHook);

const Playlist = mongoose.model('playlist', playlistSchema);

Playlist.create = (playlistName, playlistId, playlistUrl, profile) => {
  return new Playlist({
    playlistName,
    playlistId,
    playlistUrl,
    profile,
  }).save();
};

export default Playlist;
