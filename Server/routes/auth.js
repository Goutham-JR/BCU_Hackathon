const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require('../middlewares/verifyToken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
      const checkuser = await User.findOne({ email: req.body.email.toLowerCase() });
      if (checkuser) {
        return res.status(401).json({ message: 'User already registered' });
    }
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
    destination: (req, file, cb) => cb(null, uploadDir), 
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  
  const upload = multer({ storage });

  router.post("/update-profile", upload.single("profileImage"), async (req, res) => {
    try {
        const { email, name, phone, location } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required to update profile" });
        }

        let updateFields = { name, phone, location };

        if (req.file) {
            updateFields.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $set: updateFields },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            message: "Profile updated successfully!", 
            user 
        });

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



// Validate environment variables
const validateEnv = () => {
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_USER'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Initialize transporter with proper configuration
const createTransporter = () => {
  validateEnv();
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' // Only strict in production
    }
  });
};

const transporter = createTransporter();

// Verify transporter connection
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

// Generate a 4-digit OTP
const generateOTP = () => {
  return crypto.randomInt(1000, 9999).toString();
};

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Forgot password - send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  try {
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'If this email exists, we will send a reset code' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Store OTP
    otpStore.set(email, { otp, expiresAt });

    // Email content
    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Use this code to reset your password:</p>
          <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 3px; color: #4f46e5;">${otp}</h1>
          </div>
          <p>This code expires in 15 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">
            © ${new Date().getFullYear()} Your App Name
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true,
      message: 'If this email exists, we have sent a reset code' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process your request. Please try again later.' 
    });
  }
});

// Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Validate inputs
    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Email, code and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 8 characters' 
      });
    }

    // Check OTP validity
    const storedOtp = otpStore.get(email);
    if (!storedOtp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired code' 
      });
    }

    if (storedOtp.otp !== code) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid code' 
      });
    }

    if (new Date() > storedOtp.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false,
        message: 'Code has expired' 
      });
    }

    // Update user password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // In production, you should hash the password!
    user.password = newPassword;
    await user.save();

    // Clear OTP
    otpStore.delete(email);

    // Send confirmation email
    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Updated</h2>
          <p>Your password was successfully changed.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
          <p style="color: #6b7280; font-size: 14px;">
            © ${new Date().getFullYear()} Your App Name
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true,
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to reset password. Please try again later.' 
    });
  }
});


router.put('/update-password', async (req, res) => {
  const { currentPassword, newPassword, email } = req.body;

  if (!email) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authenticated. Please login first.' 
    });
  }
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'All password fields are required' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters' 
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.password !== currentPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be different from the current password' 
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'Password updated successfully' 
    });

  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please try again later.' 
    });
  }
});

module.exports = router;
