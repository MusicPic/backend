'use strict';

const superagent = require('superagent');
require('dotenv').config();

const spotifyUri = 'https://api.spotify.com/v1/search';

const getPlaylist = (searchTerm) => {
  return superagent.get(spotifyUri)
    .query({
      q: searchTerm,
      type: 'playlist',
      limit: 1,
    })
    .type('application/json')
    .set({ Authorization: `Bearer ${process.env.SPOTIFY_OAUTH_TOKEN}` })
    .then((data) => {
      return data.body.playlists.items[0];
    })
    .catch((err) => {
      console.log('ERR', err);
    });
};
// getPlaylist();

export default getPlaylist;
