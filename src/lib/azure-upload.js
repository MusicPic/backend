'use strict';

// const request = require('request');
const superagent = require('superagent');
require('dotenv').config();

const trialUrl = 'https://i.imgflip.com/vh6to.jpg';

const azureUpload = (imageUrl) => {
  // this function expects an image url, then sends a request to azure face api
  return superagent.post(process.env.URI_BASE)
    .query({ 
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: 'emotion',
    })
    .type('application/json')
    .set('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY)
    .send(`{"url": "${imageUrl}"}`)
    .then((response) => {
      // emotionData holds an object with the emotion keys on the first response object (the first face, if the image has many faces)
      const emotionData = response.body[0].faceAttributes.emotion;
      const getMax = (object) => {
        return Object.keys(object).filter((x) => {
          return object[x] === Math.max.apply(null, Object.values(object));
        });
      };
      // this is finding the most significant emotion from the emotion keys in emotionData
      const spotifySearchTerm = getMax(emotionData);
      // it should return an array of strings, the first index, beging the single most significant emotion -- 'sadness'
      return spotifySearchTerm[0];
    })
    .catch((err) => {
      throw err;
    });
};
// to test this file manually, navigate to this folder in the CLI, update the .env file and call azureUpload(trialUrl)

export default azureUpload;
