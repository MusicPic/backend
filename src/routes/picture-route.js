'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import multer from 'multer';
import HttpError from 'http-errors';
import azureUpload from '../lib/azure-upload';
import Picture from '../models/picture';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
// import Profile from '../models/profile';

const jsonParser = json();
const multerUpload = multer({ dest: `${__dirname}/../temp` });

const pictureRouter = new Router();
// multer attaches a files propert to the request object, multerUpload.single(feildname)- feildname being a string, i think is what we want

pictureRouter.post('/picture', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  // logger.log(logger.INFO, 'IN PICTURE POST', request.files[0]);
  logger.log(logger.INFO, 'IN PICTURE URL', request.body.url);
  const requestString = JSON.stringify(request.body.url);
  logger.log(logger.INFO, 'REQUEST STRING TYPE', typeof requestString);
  // request.body should be an object {url:httpetc}
  return azureUpload(request.body)
    .then((keyword) => {
      logger.log(logger.INFO, 'KEYWORD AFTER AZURE', keyword);
      request.body.keyword = keyword;
      logger.log(logger.INFO, 'SAVING PITCTURE DATA', request.body.keyword);
      // to reconfigure with AWS would need to first upload picture to AWS, then save the Picture to DB and then use url property from db to call azure
      return Picture.create(request.body.keyword, request.body.url);
    })
    .then(() => {
      logger.log(logger.INFO, 'PICTURE RETURNING', request);
      // request.body contains, keyword and url properties
      return request;
    })
    .catch(next);
});

export default pictureRouter;
// return Profile.findOne({ account: request.account._id })
//     .then((profile) => {
//       logger.log(logger.INFO, 'PICTURE ROUTE PROFILE', profile);
//       request.body.profile = profile._id;
//     })
