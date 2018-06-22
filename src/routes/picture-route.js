'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import multer from 'multer';
import HttpError from 'http-errors';
import { s3Upload } from '../lib/s3';
import azureUpload from '../lib/azure-upload';
import Picture from '../models/picture';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import getPlaylist from '../lib/spotify-playlist';
import superagent from 'superagent';
// import Profile from '../models/profile';


const jsonParser = json();
const multerUpload = multer({ dest: `${__dirname}/../temp` });
// multer attaches a file property to the request object
const pictureRouter = new Router();

pictureRouter.post('/picture', bearerAuthMiddleware, multerUpload.single('thePicture'), jsonParser, (request, response, next) => {
  console.log('stuff vinicio would hate', request.account);
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
              // { playlist: randomPlaylist, emotion: searchTerm };
              return superagent.get(`https://api.spotify.com/v1/users/${res.playlist.owner.id}/playlists/${res.playlist.id}/tracks`)
                .type('application/json')
                .set({ Authorization: `Bearer ${request.account.accessToken}` })
                .then((songs) => {
                  res.tracks = songs.body.items.map(x => x.track.name);
                  // console.log(playlist.external_urls.spotify);
                  return response.json(res);
                });
            });
        });
    })
    .catch(next);
});

export default pictureRouter;

// pictureRouter.post('/picture', bearerAuthMiddleware, multerUpload.single('thePicture'), jsonParser, (request, response, next) => {
//   console.log('REQUEST FILE', request.file);
//   console.log('REQUEST PICTURE PATH', request.file.path);
//   console.log('ACCOUNT INFO', request.account._id);
//   if (!request.account._id) {
//     return next(new HttpError(404, 'ASSET ROUTER ERROR: asset not found, no account! '));
//   }
//   if (!request.file || !request.file.path || !request.file.filename) {
//     return next(new HttpError(400, 'ASSET ROUTER ERROR: invalid request'));
//   }
//   return Profile.findOne({ account: request.account._id })
//     .then((profile) => {
//       logger.log(logger.INFO, 'PROFILE ID', profile._id);
//       const picture = request.file;
//       const key = `${picture.filename}.${picture.originalname}`;
//       // const options = { runValidators: true, new: true };
//       // const theProfile = profile;
//       return s3Upload(picture.path, key)
//         .then((url) => {
//           console.log('URL AFTER AWS', url);
//           // response.body.url = url;
//           // logger.log(logger.INFO, 'SAVING URL', response.body.url);
//           return azureUpload(url)
//             .then((keyword) => {
//               logger.log(logger.INFO, 'KEYWORD AFTER AZURE', keyword);
//               logger.log(logger.INFO, 'PROFILE AFTER AZURE', profile._id);
//               // response.body.keyword = keyword;
//               // logger.log(logger.INFO, 'SAVING PITCTURE DATA', response.body.keyword);
//               // to reconfigure with AWS would need to first upload picture to AWS, then save the Picture to DB and then use url property from db to call azure
//               return Picture.create(
//                 keyword, 
//                 url, 
//                 profile._id,
//               );
//             })
//             .then((newPicture) => {
//               // logger.log(logger.INFO, 'PICTURE RETURNING', response.body);
//               profile.pictures.push(newPicture);
//               logger.log(logger.INFO, 'MONGO PICTURE', newPicture);
//               logger.log(logger.INFO, 'MONGO PROFILE', profile);
//               // request.body contains, keyword and url properties
//               return response.json(newPicture);
//             });
//         })
//         .catch(next);
//     });
// });
