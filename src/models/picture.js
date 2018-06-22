'use strict';

import mongoose from 'mongoose';

const pictureSchema = mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  url: { 
    type: String,
    required: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
});

const Picture = mongoose.model('picture', pictureSchema);

Picture.create = (keyword, url, profile) => {
  return new Picture({
    keyword,
    url,
    profile,
  }).save();
};

export default Picture;
