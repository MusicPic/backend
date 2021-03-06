'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import Profile from '../models/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';

const jsonParser = json();
const profileRouter = new Router();

profileRouter.post('/profile', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a POST on /profile');

  if (!request.body.account || !request.body.username) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  return new Profile({
    ...request.body,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, 'Returning a 200 and a new Profile.');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profile/me', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.put('/profile/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a PUT on /profile/:id');

  const options = { runValidators: true, new: true };

  return Profile.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedProfile) => {
      logger.log(logger.INFO, 'PROFILE: PUT - responding with 200');
      return response.json(updatedProfile);
    })
    .catch(next);
});

profileRouter.delete('/profile/:id', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'PROFILE: DELETE - responding with 204');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default profileRouter;
