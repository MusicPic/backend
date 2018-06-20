'use strict';

import { Router } from 'express';
// import { json } from 'body-parser';
import superagent from 'superagent';
import HttpError from 'http-errors';
import Account from '../models/account';
import logger from '../lib/logger';

const SPOTIFY_OAUTH_URL = 'https://accounts.spotify.com/api/token';
const OPEN_ID_URL = 'https://api.spotify.com/v1/me';

const accountRouter = new Router();

accountRouter.get('/login', (request, response) => {
  logger.log(logger.INFO, '__STEP 3.1__ - receiving code');
  logger.log(logger.INFO, `req query ${request.query.code}`);
  let accessToken;

  if (!request.query.code) {
    response.redirect(process.env.CLIENT_URL);
  } else {
    logger.log(logger.INFO, '__CODE__', request.query.code);
    logger.log(logger.INFO, '__STEP 3.2__ - sending code back');

    return superagent.post(SPOTIFY_OAUTH_URL)
      .type('form')
      .send({
        code: request.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/login`,
      })
      .then((tokenResponse) => {
        logger.log(logger.INFO, '__STEP 3.3__ - access token');
        logger.log(logger.INFO, tokenResponse.body);

        if (!tokenResponse.body.access_token) {
          response.redirect(process.env.CLIENT_URL);
        }
        accessToken = tokenResponse.body.access_token;

        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${accessToken}`);
      })
      .then((openIdResponse) => {
        logger.log(logger.INFO, '__STEP 4__ - request to open id api');
        console.log('spotify response', openIdResponse.body);

        Account.findOne({ email: openIdResponse.body.email })
          .then((resAccount) => {
            if (!resAccount) {
              logger.log(logger.INFO, 'Creating new account');
              Account.create(
                openIdResponse.body.display_name, 
                openIdResponse.body.email, 
                openIdResponse.body.id, 
                accessToken,
              )
                .then((account) => {
                  return account.pCreateToken();
                })
              
                .then((token) => {
                  logger.log(logger.INFO, 'Returning newly created account');
                  console.log('______HEREEEEEE! TOOKEN____', token);
                  response.cookie('TOKEN_COOKIE_KEY', token, { maxAge: 900000 });
                  return response.json({ token });
                })
                .catch(err => new HttpError(400, err));
            }
            logger.log(logger.INFO, 'old account block');
            resAccount.accessToken = accessToken;
            resAccount.save()
              .then((account) => {
                return account.pCreateToken();
              })
              .then((token) => {
                response.cookie('TOKEN_COOKIE_KEY', token, { maxAge: 900000 });
                console.log('___COOOOOKIE ______', response.cookie);
                return response.json({ token });
              })
              .catch(err => new HttpError(400, err));
          })
          .catch(err => new HttpError(400, err));
        response.redirect(process.env.CLIENT_URL);
      })
      .catch((error) => {
        logger.log(logger.INFO, error);
        response.redirect(`${process.env.CLIENT_URL}?error=oauth`);
      });
  }
  return null;
});

export default accountRouter;
