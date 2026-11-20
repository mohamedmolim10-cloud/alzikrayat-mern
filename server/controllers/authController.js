const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, email, password: hashedPassword, location, description, occupation
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'alzikrayat_secret_key_2026', { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, location: user.location, occupation: user.occupation }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'alzikrayat_secret_key_2026', { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, location: user.location, occupation: user.occupation }
    });
  } catch (err) {
    next(err);
  }
};
