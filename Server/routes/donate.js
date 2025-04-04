const express = require('express');
const router = express.Router();
const Donation = require('../models/donate');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (body) => {
  let msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: process.env.TO_NUMBER,
    body
  };
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (error) {
    console.error(error);
  }
};


// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


// POST /donation route
router.post('/donation', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, foodType, preparationTime, quantity, lat, lng, donoremail } = req.body;

    if (!title || !description || !foodType || !preparationTime || !quantity || !lat || !lng) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required." });
    }

    console.log("Uploaded images:", req.files.map(file => file.filename));

    const donation = new Donation({
      title,
      description,
      foodType,
      preparationTime,
      quantity,
      location: { lat, lng },
      images: req.files.map(file => file.filename),
      status: "available",
      donoremail:donoremail,
    });

    await donation.save();
    const message = `New Donation Available!
    Title: ${title}
    Food Type: ${foodType}
    Quantity: ${quantity}
    Pickup Location: (${lat}, ${lng})
    Contact: ${donoremail}`;
    sendSMS(message);
    res.status(201).json({ success: true, message: 'Donation posted successfully', donation });
  } catch (error) {
    console.error("Error in donation route:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

router.get('/fetch', async (req, res) => {
  try {
    const donations = await Donation.find(); // Fetch all donations
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

router.get('/fetches/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id); // Fetch donation by ID
    console.log(donation)
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(200).json(donation);
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ message: 'Failed to fetch donation' });
  }
});




module.exports = router;
