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
    //   request.body.profile = profile._id;
    //   console.log('REQ-BODY-PROFILE', request.body.profile);
    //   console.log('WHOLE PROFILE', profile);
    // })
    // .then(() => {
      return getPlaylist(searchTerm)
        .then((data) => {
          console.log('PLAYLIST DATA', data);
          console.log(
            data.name,
            data.id,
            data.external_urls.spotify,
            profile._id,
          );
          Playlist.create(
            data.name,
            data.id,
            data.external_urls.spotify,
            profile._id,
          )
            .then((playlist) => {
              console.log('PLAYLISTL;AKSJDFL;ASKDJF', playlist);
              console.log('____PLAYLIST_ARRAY_____', profile.playlists);
              profile.playlists.push(playlist);
              console.log('____PLAYLIST_ARRAY_____', profile.playlists);
            });
        })
        .catch(error => console.log(error));
    }) 
    .then(() => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code.');
      return response;
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
