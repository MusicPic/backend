'use strict';

import fs from 'fs-extra';

// path = directory path ptg to asset
// key = aws way to refer to filenames
// these variables inside s3Upload need to be 
// inside a function NB in docs example 1 is not the way, example 2 is the way
// this is weird but needed to get mock environment to work

const s3Upload = (path, key) => {
  const AWS = require('aws-sdk'); 
  const amazonS3 = new AWS.S3(); 
  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };
  return amazonS3.upload(uploadOptions)
    .promise()
    .then((response) => {
      return fs.remove(path)
        .then(() => {
          return response.Location;
        })
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fserr => Promise.reject(fserr));
    });
};

export default { s3Upload };
