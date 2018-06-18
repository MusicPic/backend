'use strict';

import mongoose from 'mongoose';

const pictureSchema = mongoose.Schema({
  keywords: [{ 
    keyword: String
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

export default mongoose.model('picture', pictureSchema);