const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  title: String,
  description: String,
  foodType: String,  
  preparationTime: String,  
  quantity: Number,
    lat: Number,
    lng: Number,
  images: [String],
  donoremail: String,
  status: String  
}, {
  timestamps: true
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;