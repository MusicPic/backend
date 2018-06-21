'use strict';

import fs from 'fs-extra';

// path = directory path ptg to asset
// key = aws way to refer to filenames
// these variables inside s3Upload need to be inside a function NB in docs example 1 is not the way, example 2 is the way
// this is weird but needed to get mock environment to work

const s3Upload = (path, key) => {
  console.log('in s3 upload:', `PATH: ${path} and KEY: ${key}`);
  console.log('AWS UPLOADING: ', fs.createReadStream(path));
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
      console.log('S3 RESPONSE: ', response);
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

const s3Remove = (key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions)
    .promise()
    .then((data) => {
      console.log(data, 'AWS SUCCESSFUL DELETION');
    })
    .catch((err) => {
      Promise.reject(err);
    });
};

export { s3Upload, s3Remove };
