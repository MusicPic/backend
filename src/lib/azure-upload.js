'use strict';

// const request = require('request');
const superagent = require('superagent');
require('dotenv').config();

// const subscriptionKey = process.env.AZURE_KEY;

// const uriBase = process.env.URI_BASE;

const trialUrl = 'https://i.imgflip.com/vh6to.jpg';

// const params = {
//   returnFaceId: 'true',
//   returnFaceLandmarks: 'false',
//   returnFaceAttributes: 'emotion',
// };

// const options = {
//   uri: uriBase,
//   qs: params,
//   body: `{"url": "${imageUrl}"}`,
//   headers: {
//     'Content-Type': 'application/json',
//     'Ocp-Apim-Subscription-Key': subscriptionKey,
//   },
// };

const azureUpload = (imageUrl) => {
  // const params = {
  //   returnFaceId: 'true',
  //   returnFaceLandmarks: 'false',
  //   returnFaceAttributes: 'emotion',
  // };
  // const options = {
  //   uri: process.env.URI_BASE,
  //   qs: params,
  //   body: `{"url": "${imageUrl}"}`,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
  //   },
  // };
  return superagent.post(`${process.env.URI_BASE}`)
    .query({ 
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: 'emotion',
    })
    .type('application/json')
    .set('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY)
    .send(`{"url": "${imageUrl}"}`)
    .then((response) => {
      console.log('DATA body', response.body[0].faceAttributes.emotion);
      const emotionData = response.body[0].faceAttributes.emotion;
      const getMax = (object) => {
        return Object.keys(object).filter((x) => {
          return object[x] === Math.max.apply(null, Object.values(object));
        });
      };
      const spotifySearchTerm = getMax(emotionData);
      console.log('spotify search term', spotifySearchTerm[0]);
      return spotifySearchTerm[0];
    })
    .catch((err) => {
      console.log('ERR', err);
    });
    
    
  //   options, (error, response, body) => {
  //   if (error) {
  //     console.log('Error: ', error);
  //     return;
  //   }
  //   const parsedJSON = JSON.parse(body);
  //   const emotionData = parsedJSON[0].faceAttributes.emotion;
  //   console.log('EMOTION DATA', emotionData);
  //   const getMax = (object) => {
  //     return Object.keys(object).filter((x) => {
  //       return object[x] === Math.max.apply(null, Object.values(object));
  //     });
  //   };
  //   const spotifySearchTerm = getMax(emotionData);
  //   console.log('spotify search term', spotifySearchTerm[0]);
  //   // return spotifySearchTerm[0];
  // });
};
azureUpload(trialUrl)
  .then(response => console.log('response', response))
  .catch(err => console.log('error', err));
// console.log('function return', azureUpload(trialUrl));
module.exports.azureUpload = azureUpload;
