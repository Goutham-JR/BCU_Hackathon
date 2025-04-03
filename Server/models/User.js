const mongoose = require('mongoose');
const { stringify } = require('querystring');

const UserSchema = new mongoose.Schema({
  userType: String,
  name: String,
  email: String,
  phone: String,
  password: String,
  address: String,
  city: String,
  zip: String,
  kitchenName: String,
  profileImage : String
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
