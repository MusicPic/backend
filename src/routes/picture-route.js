'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import superagent from 'superagent';
import multer from 'multer';
import HttpError from 'http-errors';
import s3Upload from '../lib/s3';
import azureUpload from '../lib/azure-upload';
import Picture from '../models/picture';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import getPlaylist from '../lib/spotify-playlist';

// const util = require('util');

const jsonParser = json();
const multerUpload = multer({ dest: `${__dirname}/../temp` });
// multer attaches a file property to the request object
const pictureRouter = new Router();

pictureRouter.post('/picture', bearerAuthMiddleware, multerUpload.single('thePicture'), jsonParser, (request, response, next) => {
  if (!request.account._id) {
    return next(new HttpError(404, 'ASSET ROUTER ERROR: asset not found, no account! '));
  }
  if (!request.file || !request.file.path || !request.file.filename) {
    return next(new HttpError(400, 'ASSET ROUTER ERROR: invalid request'));
  }
  const picture = request.file;
  const key = `${picture.filename}.${picture.originalname}`;

  return s3Upload(picture.path, key)
    .then((url) => {
      logger.log(logger.INFO, `URL AFTER AWS: ${url}`);
      return azureUpload(url)
        .then((keyword) => {
          logger.log(logger.INFO, `KEYWORD AFTER AZURE: ${keyword}`);
          Picture.create(
            keyword, 
            url, 
          );
          return getPlaylist(keyword, request.account.accessToken)
            .then((res) => {
              return superagent.get(`https://api.spotify.com/v1/users/${res.playlist.owner.id}/playlists/${res.playlist.id}/tracks`)
                .type('application/json')
                .set({ Authorization: `Bearer ${request.account.accessToken}` })
                .then((songs) => {
                  res.tracks = {}; 
                  res.tracks.name = songs.body.items.map(x => x.track.name);
                  res.tracks.artists = songs.body.items.map(x => x.track.artists[0].name);
                  console.log('RESPONSE TRACKS', res.tracks);
                  // console.log('RESPONSE ARTISTS', response.artists);
                  return response.json(res);
                });
            });
        });
    })
    .catch(next);
});

export default pictureRouter;
