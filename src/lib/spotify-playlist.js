'use strict';

import superagent from 'superagent';
import logger from './logger';

require('dotenv').config();

const spotifyUri = 'https://api.spotify.com/v1/search';

const getPlaylist = (searchTerm) => {
  return superagent.get(spotifyUri)
    .query({
      q: searchTerm,
      type: 'playlist',
      limit: 10,
    })
    .type('application/json')
    .set({ Authorization: `Bearer ${process.env.SPOTIFY_OAUTH_TOKEN}` })
    .then((data) => {
      const playlistArray = data.body.playlists.items;
      const randomPlaylist = playlistArray[Math.floor(Math.random() * playlistArray.length)];
      // console.log(playlistArray);
      console.log(randomPlaylist);
      return randomPlaylist;
    })
    .catch((err) => {
      logger.log(logger.ERROR, `ERR, ${err}`);
    });
};

export default getPlaylist;
