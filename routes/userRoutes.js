const express = require('express');
const { User } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../helpers/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, role });
  res.json({ user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).send('User not found');
  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(400).send('Invalid credentials');
  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;
