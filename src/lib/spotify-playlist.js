'use strict';

const superagent = require('superagent');
require('dotenv').config();

const spotifyUri = 'https://api.spotify.com/v1/search';

const searchTerm = '';

const getPlaylist = () => {
  return superagent.get(spotifyUri)
    .query({
      q: searchTerm,
      type: 'playlist',
      limit: 1,
    })
    .type('application/json')
    .set({ Authorization: `Bearer ${process.env.SPOTIFY_OAUTH_TOKEN}` })
    .then((data) => {
      console.log('DATA', data.body.playlists.items[0].id, data.body.playlists.items[0].name, data.body.playlists.items[0].external_urls.spotify);
      return (
        data.body.playlists.items[0].id,
        data.body.playlists.items[0].name,
        data.body.playlists.items[0].external_urls.spotify
      );
    })
    .catch((err) => {
      console.log('ERR', err);
    });
};
getPlaylist();

module.exports.getPlaylist = getPlaylist;
