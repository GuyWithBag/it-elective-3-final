const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT user_id, username, password, role FROM users WHERE username = ? LIMIT 1',
      [username],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    req.session.user = safeUser;

    return res.json({ user: safeUser });
  } catch (error) {
    console.error('Login failed', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) return res.status(200).json({ ok: true });
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  return res.json({ user: req.session.user });
});

module.exports = router;



