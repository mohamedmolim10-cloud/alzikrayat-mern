const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Please login to perform this action' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alzikrayat_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};
