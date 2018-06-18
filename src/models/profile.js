'use strict';
import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  picture: [{
    type: String,
  }],
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

const Profile = mongoose.model('profile', profileSchema);