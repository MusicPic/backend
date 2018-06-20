'use strict';

const superagent = require('superagent');
require('dotenv').config();


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
      console.log(err.text);
      throw err;
    });
};
// to test this file manually, navigate to this folder in the CLI, update the .env file and call 
// azureUpload(trialUrl) trialUrl should be a string5
// 
const trialUrl = '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…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';
// 
azureUpload(trialUrl);

// export default azureUpload;
