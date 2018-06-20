'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';

import Playlist from '../models/playlist';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../models/profile';
import getPlaylist from '../lib/spotify-playlist';

const jsonParser = json();
const playlistRouter = new Router();
const searchTerm = 'avatar';

playlistRouter.post('/profile/playlist', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      return getPlaylist(searchTerm)
        .then((data) => {
          logger.log(logger.INFO, `PLAYLIST DATA, ${JSON.stringify(data)}`);
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
    })
    .catch(next);
});

playlistRouter.delete('/profile/playlist/:id', bearerAuthMiddleware, (request, response, next) => {
  return Playlist.findById(request.params.id)
    .then((playlist) => {
      if (!playlist) {
        return next(new HttpError(404, 'playlist not found.'));
      }
      playlist.remove();
      return response.sendStatus(204);
    });
});

export default playlistRouter;
