'use strict';

const request = require('request');
require('dotenv').config();

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = process.env.AZURE_KEY;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westus2.api.cognitive.microsoft.com/face/v1.0/detect/';

const imageUrl = 'https://kathrynweldsblog.files.wordpress.com/2013/11/ekman-emotion-sstock-photo.png';

// Request parameters.
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
console.log('options', options);

request.post(options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }
  const jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
  console.log('JSON Response\n');
  console.log(jsonResponse);
});
