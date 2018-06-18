'use strict';

import mongoose from 'mongoose';

const pictureSchema = mongoose.Schema({
  keywords: [{ 
    keyword: String,
  }],
  url: { 
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(), 
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
    required: true,
  },
});

const Picture = mongoose.model('picture', pictureSchema);

export default Picture;
