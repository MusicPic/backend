# MusicPic

**```Authors```**```: ```

David Stoll 

[![linkedin link](https://img.shields.io/badge/link-linkedin-green.svg?longCache=true&style=for-the-badge)](https://www.linkedin.com/in/dstoll243/)

Joanna Coll 

[![linkedin link](https://img.shields.io/badge/link-linkedin-green.svg?longCache=true&style=for-the-badge)](https://www.linkedin.com/in/joanna-coll/)

Sarah Bixler

[![linkedin link](https://img.shields.io/badge/link-linkedin-green.svg?longCache=true&style=for-the-badge)](https://www.linkedin.com/in/sarah-bixler/)

Kris Sakarias 

[![linkedin link](https://img.shields.io/badge/link-linkedin-green.svg?longCache=true&style=for-the-badge)](https://www.linkedin.com/in/kris-sakarias/)

**```Version```**: 1.0.0

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

## Functionality

  ```GET /login```
- This endpoint is only accessible via a link on the front-end to Spotify's authorization system. If authorized, the user's Spotify account information is shared with MusicPic and a user profile is saved for future use. After logging in, the user can then enjoy the main functionality of the app.

`GET /profile/me`
- Upon logging in with Spotify, the system will retrieve the user's profile and return it to the front end to render on the user's dashboard.

`POST /picture`
- After logging in, the user has the ability to upload an image file. When the file is submitted, it is uploaded to AWS and the url is returned. This url is then used to call the Microsoft Azure API, which identifies the dominant mood of the image.

- The mood of the user's image is then used to call the spotify API and returns a random playlist based on the user's mood. A further call to the Spotify API finds and returns the tracks in the randomly generated playlist. The relevant playlist information, mood, and playlist tracks are returned to and handled by the front-end.

## User Flow
![User Flow Chart](./src/assets/flow-chart.jpg)

## Architecture
This is the back-end for a front-end that can be cloned here: `https://github.com/MusicPic/frontend.git`

Consult the README in the front-end repo for more information.


The backend server is running with Node.js and is built entirely with Javascript. The REST API utilizes Express and we persist data with MongoDB. The server development has been driven by robust unit-testing (see below) and is continously integrated and deployed on Heroku. Several other libraries and dependencies are used - consult the package.json file for a complete list.

The app also uses the Microsoft Azure Face API, Spotify API, and Spotify OAUTH.

## Testing

All of the above functionality is tested using the Jest library. 

To run tests: `npm run test`
