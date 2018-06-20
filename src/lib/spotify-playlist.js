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
      limit: 1,
    })
    .type('application/json')
    .set({ Authorization: 'Bearer BQDrfW7_Ssv6sB_r0tAW0mhh9W_4VXI9gPtmXrpendo8KU3APNgrQaWA0HkGyCxTIOV7hKLt7v_WjXMwCps5OyBjnsbq-D25nvhIPL80YjtZMyY8CWQdp-WEKcnGahlPR1Q3iEkjwf4qLKPaU1nH9u6DkP0h4t9J-k1xKzpQGfFuitKTiXcnfl2D39achmzh7g1_efU' })
    .then((data) => {
      return data.body.playlists.items[0];
    })
    .catch((err) => {
      logger.log(logger.ERROR, `ERR, ${err}`);
    });
};

export default getPlaylist;
