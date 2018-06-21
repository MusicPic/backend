'use strict';

import { Router } from 'express';
import { json } from 'body-parser';

import Playlist from '../models/playlist';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../models/profile';
import getPlaylist from '../lib/spotify-playlist';

const jsonParser = json();
const playlistRouter = new Router();
const searchTerm = 'joanna';

playlistRouter.post('/profile/playlist', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      return getPlaylist(searchTerm)
        .then((data) => {
          return Playlist.create(
            data.name,
            data.id,
            data.external_urls.spotify,
            profile._id,
          )
            .then((playlist) => {
              profile.playlists.push(playlist);
              return profile;
            });
        })
        .catch(error => logger.log(logger.ERROR, `${error}`));
    }) 
    .then((profile) => {
      return response.json({ profile });
    })
    .catch(next);
});

export default playlistRouter;
