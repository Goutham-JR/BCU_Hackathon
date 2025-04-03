const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
  jobTitle: String,
  phoneNumber: String,
  accountType: String,
  avatar: String,
  bio: String,
  status: { type: String, default: 'Pending' },
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
