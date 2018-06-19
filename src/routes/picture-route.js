'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
// import multer from 'multer';

import Picture from '../models/picture';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../models/profile';
// import { s3Upload } from '../lib/s3';

const jsonParser = json();
// const multerUpload = multer({ dest: `${__dirname}/../temp` });

const pictureRouter = new Router();

pictureRouter.post('/picture', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.body.url || !request.body.keywords) {
    return next(new HttpError(400, 'invalid request.'));
  }
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      request.body.profile = profile._id;
    })
    .then(() => {
      return new Picture(request.body).save()
        .then((picture) => {
          logger.log(logger.INFO, 'POST - responding with a 200 status code.');
          return response.json(picture);
        });
    })
    .catch(next);
});

