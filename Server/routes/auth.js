const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    console.log(username, password)
    if (!user) {
      return res.status(401).json({ message: 'Invalid UserID' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'User is Suspended, Please contact to Admin' });
    }

    console.log(user.password)
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
        accountType: user.accountType,
        department: user.department,
        jobTitle:user.jobTitle,
        phoneNumber:user.phoneNumber,
        bio:user.bio,
        avatar:user.avatar,
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

module.exports = router;
