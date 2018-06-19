'use strict';

const request = require('request');
require('dotenv').config();

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = process.env.AZURE_KEY;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westus2.api.cognitive.microsoft.com/face/v1.0/detect/';

const imageUrl = 'https://www.otago.ac.nz/cs/groups/public/documents/webcontent/otago005091.jpg';

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
// console.log('options', options);

request.post(options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }
  // console.log(body);
  const parsedJSON = JSON.parse(body);
  // console.log('____PARSED-BODY____', parsedJSON[0].faceAttributes.emotion);
  const emotionData = parsedJSON[0].faceAttributes.emotion;
  console.log(emotionData);
  console.log(emotionData.anger);
  // const jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
  // console.log('JSON Response\n');
  // console.log(jsonResponse);
});
