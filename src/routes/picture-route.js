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
  console.log('IN PICTURE POST', request.body);
  if (!request.body.url || !request.body.account) {
    return next(new HttpError(400, 'invalid request.'));
  }
  // return azureUpload(request.body.url)
  console.log('PICTURE ROUTE', request.body);
  console.log('PICTURE ROUTE ACCOUNT ID', request.body.account);
  return Profile.findOne({ account: request.body.account })
    .then((profile) => {
      console.log('PICTURE ROUTE PROFILE', profile);
      request.body.profile = profile._id;
    })
    .then(() => {
      return azureUpload(request.body.url)
        .then((keyword) => {
          request.body.keyword = keyword;
          console.log('SAVING PITCTURE DATA', request.body);
          return new Picture(request.body).save();
        })
        .then((picture) => {
          logger.log(logger.INFO, 'POST - responding with a 200 status code.');
          return response.json(picture);
        });
    })
    .catch(next);
});

export default pictureRouter;
