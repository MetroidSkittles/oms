const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String
  }
}));

module.exports = User;