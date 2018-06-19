'use strict';

// const request = require('request');
const superagent = require('superagent');
require('dotenv').config();

const trialUrl = 'https://i.imgflip.com/vh6to.jpg';

const azureUpload = (imageUrl) => {
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
      const emotionData = response.body[0].faceAttributes.emotion;
      const getMax = (object) => {
        return Object.keys(object).filter((x) => {
          return object[x] === Math.max.apply(null, Object.values(object));
        });
      };
      const spotifySearchTerm = getMax(emotionData);
      return spotifySearchTerm[0];
    })
    .catch((err) => {
      throw err;
    });
};

// azureUpload(trialUrl)
//   .then(response => console.log('response', response))
//   .catch(err => console.log('error!', err.status));
module.exports.azureUpload = azureUpload;
