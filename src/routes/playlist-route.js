'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';

import Playlist from '../models/playlist';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../models/profile';

const jsonParser = json();
const playlistRouter = new Router();

playlistRouter.post('/profile/playlist', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.body.image || !request.body.playlistId) {
    return next(new HttpError(400, 'invalid request'));
  }
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      request.body.profile = profile._id;
    })
    .then(() => {
      return new Playlist(request.body).save()
        .then((playlist) => {
          logger.log(logger.INFO, 'POST - responding with a 200 status code.');
          return response.json(playlist);
        });
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
