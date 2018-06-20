'use strict';

import superagent from 'superagent';
import logger from './logger';

require('dotenv').config();


const azureUpload = (image) => {
  console.log('IN AZURE ARG:', image);
  // this function expects an image url, then sends a request to azure face api
  return superagent.post(process.env.URI_BASE)
    .query({ 
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: 'emotion',
    })
    .type('application/json')
    .set('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY)
    .send(image)
    .then((response) => {
      // emotionData holds an object with the emotion keys on the first response object 
      // (the first face, if the image has many faces)
      const emotionData = response.body[0].faceAttributes.emotion;
      const getMax = (object) => {
        return Object.keys(object).filter((x) => {
          return object[x] === Math.max.apply(null, Object.values(object));
        });
      };
      // this is finding the most significant emotion from the emotion keys in emotionData
      const spotifySearchTerm = getMax(emotionData);
      // it should return an array of strings, the first index, 
      // beging the single most significant emotion -- 'sadness'
      logger.log(logger.INFO, 'SEARCH TERM:', spotifySearchTerm[0]);
      return spotifySearchTerm[0];
    })
    .catch((err) => {
      console.log(err.text);
      throw err;
    });
};
// to test this file manually, navigate to this folder in the CLI, update the .env file and call 
// azureUpload(trialUrl) trialUrl should be a string5
// 
// const trialUrl = 
// // 
// azureUpload(trialUrl);

export default azureUpload;
// if application.json
//.send(`{"url": "${imageUrl}"}`)