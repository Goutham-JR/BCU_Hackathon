const express = require('express');
const router = express.Router();
const Donation = require('../models/donate');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  const upload = multer({ storage });

router.post('/donation', upload.array('images', 5), async (req, res) => {
    try {
      const {
        title,
        description,
        foodType,
        preparationTime,
        quantity,
        lat,
        lng, // Already an object
      } = req.body;
      const imagePaths = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;


      // Process uploaded images
  
      const newDonation = new Donation({
        title,
        description,
        foodType, 
        preparationTime, 
        quantity,
        lat: lat, 
        lng: lng,
        images: imagePaths, // Store paths to uploaded images
        donoremail: "decoded.email", // Get from JWT token
        status: 'available' 
      });

      console.log(newDonation)
  
      const savedDonation = await newDonation.save();
  
      res.status(200).json({ 
        success: true,
        message: 'Food donation posted successfully!',
        donation: {
          id: savedDonation._id,
          title: savedDonation.title,
          status: savedDonation.status,
          images: savedDonation.images,
          createdAt: savedDonation.createdAt
        }
      });
      
    } catch (error) {
      console.error('Donation error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
});

  
module.exports = router;