'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import azureUpload from '../lib/azure-upload';
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
  logger.log(logger.INFO, 'IN PICTURE POST', request.body);
  if (!request.body.url || !request.body.account) {
    return next(new HttpError(400, 'invalid request.'));
  }
  logger.log(logger.INFO, 'PICTURE ROUTE', request.body);
  logger.log(logger.INFO, 'PICTURE ROUTE ACCOUNT ID', request.body.account);
  return Profile.findOne({ account: request.body.account })
    .then((profile) => {
      logger.log(logger.INFO, 'PICTURE ROUTE PROFILE', profile);
      request.body.profile = profile._id;
    })
    .then(() => {
      logger.log(logger.INFO, 'PICTURE ROUTE AZURE', request.body.url);
      return azureUpload(request.body.url)
        .then((keyword) => {
          logger.log(logger.INFO, 'AFTER AZURE', keyword);
          request.body.keyword = keyword;
          logger.log(logger.INFO, 'SAVING PITCTURE DATA', request.body);
          return new Picture(request.body).save();
        })
        .then((picture) => {
          logger.log(logger.INFO, 'PICTURE SAVED', picture);
          return picture;
        })
        .then(() => {
          logger.log(logger.INFO, 'PICTURE RETURNING', response.statusCode);
          return response;
        });
    })
    .catch(next);
});

export default pictureRouter;
