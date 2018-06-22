'use strict';

import { Router } from 'express';
import superagent from 'superagent';
import Account from '../models/account';
import logger from '../lib/logger';
import Profile from '../models/profile';

const SPOTIFY_OAUTH_URL = 'https://accounts.spotify.com/api/token';
const OPEN_ID_URL = 'https://api.spotify.com/v1/me';

const accountRouter = new Router();

accountRouter.get('/login', (request, response) => {
  let accessToken;

  if (!request.query.code) {
    response.redirect(process.env.CLIENT_URL);
  } else {
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
        if (!tokenResponse.body.access_token) {
          response.redirect(process.env.CLIENT_URL);
        }
        accessToken = tokenResponse.body.access_token;

        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${accessToken}`);
      })
      .then((openIdResponse) => {
        Account.findOne({ email: openIdResponse.body.email })
          .then((resAccount) => {
            if (!resAccount) {
              logger.log(logger.INFO, 'Creating new account');

              let name;
              if (!openIdResponse.body.display_name) {
                name = 'Spotify User';
              } else {
                name = openIdResponse.body.display_name;
              }

              return Account.create(
                name,
                openIdResponse.body.email, 
                openIdResponse.body.id, 
                accessToken,
              )
                .then((account) => {
                  Profile.create(
                    account.username,
                    account._id,
                    account.accessToken,
                  );
                  return account;
                })

                .then((account) => {
                  return account.pCreateToken();
                })
                .then((token) => {
                  logger.log(logger.INFO, 'Returning newly created account');
                  response.cookie('TOKEN_COOKIE_KEY', token, { maxAge: 900000 });
                  response.redirect(`${process.env.CLIENT_URL}/dashboard`);
                })
                .catch(() => {
                  response.redirect(process.env.CLIENT_URL);
                });
            }

            logger.log(logger.INFO, 'Returning existing account');
            resAccount.accessToken = accessToken;

            Profile.findOne({ account: resAccount._id })
              .then((profile) => {
                profile.accessToken = accessToken;
                return profile.save();
              });

            return resAccount.save()
              .then((account) => {
                return account;
              })
              .then((account) => {
                return account.pCreateToken();
              })
              .then((token) => {
                response.cookie('TOKEN_COOKIE_KEY', token, { maxAge: 900000 });
                response.redirect(`${process.env.CLIENT_URL}/dashboard`);
              })
              .catch(() => {
                response.redirect(process.env.CLIENT_URL);
              });
          })
          .catch(() => {
            response.redirect(process.env.CLIENT_URL);
          });
      })
      .catch((error) => {
        logger.log(logger.INFO, error);
        response.redirect(process.env.CLIENT_URL);
      });
  }
  return null;
});

export default accountRouter;
