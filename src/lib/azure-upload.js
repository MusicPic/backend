'use strict';

import superagent from 'superagent';
import HttpError from 'http-errors';

require('dotenv').config();


const azureUpload = (image) => {
  // this function expects an image url, then sends a request to azure face api
  return superagent.post(process.env.URI_BASE)
    .query({ 
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: 'emotion',
    })
    .type('application/json')
    .set('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY)
    .send(`{"url": "${image}"}`)
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
      return spotifySearchTerm[0];
    })
    .catch((err) => {
      return new HttpError(400, err);
    });
};

export default azureUpload;
