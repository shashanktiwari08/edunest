const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware');

// Login endpoint checking Supabase mobile number
router.post('/login', async (req, res) => {
  const { mobile_number, password } = req.body;

  if (!mobile_number || !password) {
    return res.status(400).json({ error: 'Mobile number and password are required' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('mobile_number', mobile_number)
      .maybeSingle();

    if (error) {
      console.error('Supabase lookup error:', error.message);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, mobile_number: user.mobile_number, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile_number: user.mobile_number,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Verify token session state
router.get('/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
