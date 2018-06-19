'use strict';

const request = require('request');
require('dotenv').config();

const subscriptionKey = process.env.AZURE_KEY;

const uriBase = 'https://westus2.api.cognitive.microsoft.com/face/v1.0/detect/';

const imageUrl = 'http://www.rmmagazine.com/wp-content/uploads/2012/08/Sad-Face.png';

const params = {
  returnFaceId: 'true',
  returnFaceLandmarks: 'false',
  returnFaceAttributes: 'emotion',
};

const options = {
  uri: uriBase,
  qs: params,
  body: `{"url": "${imageUrl}"}`,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscriptionKey,
  },
};

const azureUpload = request.post(options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }
  const parsedJSON = JSON.parse(body);
  const emotionData = parsedJSON[0].faceAttributes.emotion;
  console.log(emotionData);
  const getMax = (object) => {
    return Object.keys(object).filter((x) => {
      return object[x] === Math.max.apply(null, Object.values(object));
    });
  };
  const spotifySearchTerm = getMax(emotionData);
  console.log(spotifySearchTerm[0]);
});

module.exports.azureUpload = azureUpload;
