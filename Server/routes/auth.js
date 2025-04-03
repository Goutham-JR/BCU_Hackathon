const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require('../middlewares/verifyToken');
const User = require('../models/User');
const router = express.Router();

router.get('/check-auth', verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ email: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid UserID' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'User is Suspended, Please contact to Admin' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('Missing JWT_SECRET environment variable');
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address:user.address,
        city:user.city,
        zip:user.zip,
        kitchenName:user.kitchenName,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, message: 'Login Successful!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  res.status(200).json({ message: 'Logout successful!' });
});

router.post("/register", async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Error registering user" });
    }
  });
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir), // Use the absolute path
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  
  const upload = multer({ storage });

  router.post("/update-profile", upload.single("profileImage"), async (req, res) => {
    try {
        console.log("Uploaded file:", req.file); // Debugging line
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const { email, name, phone, location } = req.body;
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        const user = await User.findOneAndUpdate(
            { email },
            { $set: { name, phone, location, profileImage: imageUrl } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully!", imageUrl, user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});


router.get("/get-image/:email", async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send("Image not found");
      }
  
      res.redirect(`${user.profileImage}`);
    } catch (error) {
      res.status(500).send("Server error");
    }
  });
  


module.exports = router;
