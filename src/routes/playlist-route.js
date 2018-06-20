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
<<<<<<< HEAD
=======
          logger.log(logger.INFO, `PLAYLIST DATA, ${JSON.stringify(data)}`);
>>>>>>> 11778a0fa8f979f0a3893334a2c95f0e818dd50f
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
<<<<<<< HEAD
      return response.json({ profile });
=======
      logger.log(logger.INFO, 'POST - responding with a 200 status code.');
      return response.json({ profile });
    })
    .catch(next);
});

playlistRouter.get('/profile/playlist/:id', bearerAuthMiddleware, (request, response, next) => {
  return Playlist.findById(request.params.id)
    .then((playlist) => {
      if (!playlist) {
        return next(new HttpError(404, 'playlist not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code.');
      logger.log(logger.INFO, `GET - ${JSON.stringify(playlist)}`);
      return response.json(playlist);
>>>>>>> 11778a0fa8f979f0a3893334a2c95f0e818dd50f
    })
    .catch(next);
});

export default playlistRouter;
