'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import multer from 'multer';
import HttpError from 'http-errors';
import azureUpload from '../lib/azure-upload';
import Picture from '../models/picture';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../models/profile';

const jsonParser = json();
const multerUpload = multer({ dest: `${__dirname}/../temp` });

const pictureRouter = new Router();
// multer attaches a files propert to the request object, multerUpload.single(feildname)- feildname being a string, i think is what we want

pictureRouter.post('/picture', bearerAuthMiddleware, multerUpload.any(), jsonParser, (request, response, next) => {
  console.log('IN PICTURE POST', request.body);
  if (!request.body.picture || !request.body.account) {
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
      logger.log(logger.INFO, 'PICTURE ROUTE AZURE', request.body.picture);
      // first upload to AWS
      // then return new Picture
      // then upload picture.url to azure
      return azureUpload(request.body.picture)
        .then((keyword) => {
          logger.log(logger.INFO, 'AFTER AZURE', keyword);
          request.body.keyword = keyword;
          logger.log(logger.INFO, 'SAVING PITCTURE DATA', request.body);
          // to reconfigure with AWS would need to first upload picture to AWS, then save the Picture to DB and then use url property from db to call azure
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
