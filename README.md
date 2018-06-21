# MusicPic

**Authors**: David Stoll, Joanna Coll, Sarah Bixler, Kris Sakarias

**Version**: 1.0.0

## Overview

MusicPic helps you find music you may be interested in depending on your mood. A user must sign in to the app with their Spotify account. After being authenticated by Spotify, users can upload images of themselves (or anyone), which are then used by the app in conjunction with Microsoft Azure's Face API to determine the mood of the person in the picture. This information is then used to find a relevant playlist on Spotify for the user to listen to. 

No matter what mood you're in, MusicPic will be there to find the perfect playlist for you.

## Setup

Starting the Server:

```
git clone https://github.com/MusicPic/backend.git

npm i

mongod

npm run start
```

### Functionality

  ```GET /login```
- This endpoint is only accessible via a link on the front-end to Spotify's authorization system. If authorized, the user's Spotify account information is shared with MusicPic and saved for future use. After logging in, the user can then enjoy the main functionality of the app.

`POST /profile`

`GET /profile/me`

`PUT /profile/:id`

`DELETE /profile`


#### Architecture
This is the back-end for a front-end that can be cloned here: `https://github.com/MusicPic/frontend.git`

Consult the README in the front-end repo for more information.


The backend server is running with Node.js and is built entirely with Javascript. The REST API utilizes Express and we persist data with MongoDB. The server development has been driven by robust unit-testing (see below) and is continously integrated and deployed on Heroku. Several other libraries and dependencies are used - consult the package.json file for a complete list.

#### Testing

All of the above functionality is tested using the Jest library. 

To run tests: `npm run test`
