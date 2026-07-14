const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// SIGN UP
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Signup successful! Check your email to confirm.', user: data.user });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });
});

// LOGOUT
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Logged out successfully' });
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Password reset email sent' });
});

module.exports = router;