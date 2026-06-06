const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db');
const crypto = require('crypto');
const { JWT_SECRET, authenticateToken } = require('../middleware');

// Registration endpoint with mock payment tracking
router.post('/register', async (req, res) => {
  const { name, mobile_number, password, plan_name, amount, transaction_id } = req.body;

  if (!name || !mobile_number || !password || !plan_name || !amount) {
    return res.status(400).json({ error: 'All primary fields (name, mobile_number, password, plan_name, amount) are required' });
  }

  try {
    // Check if mobile number is already registered in Supabase
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('mobile_number', mobile_number)
      .maybeSingle();

    if (lookupError) {
      console.error('Supabase lookup error:', lookupError.message);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into Supabase as an Admin
    const { error: userErr } = await supabase.from('users').insert({
      id: userId,
      name,
      mobile_number,
      password_hash: passwordHash,
      role: 'admin'
    });

    if (userErr) {
      console.error('Error creating user in Supabase:', userErr.message);
      return res.status(500).json({ error: 'Failed to create user account' });
    }

    // Insert subscription payment record into finances table
    const todayStr = new Date().toISOString().split('T')[0];
    const financeId = crypto.randomUUID();
    const { error: finErr } = await supabase.from('finances').insert({
      id: financeId,
      user_id: userId,
      type: 'fee', // Keep type as fee/salary to conform to database checks
      amount_total: parseFloat(amount),
      amount_paid: parseFloat(amount),
      amount_pending: 0.0,
      due_date: todayStr,
      status: 'paid'
    });

    if (finErr) {
      console.warn('Warning: Could not create finance entry:', finErr.message);
    }

    // Generate JWT token for immediate access
    const token = jwt.sign(
      { id: userId, name, mobile_number, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Account registered successfully with subscription!',
      token,
      user: {
        id: userId,
        name,
        mobile_number,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});


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
