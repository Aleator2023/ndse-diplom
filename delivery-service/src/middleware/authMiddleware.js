const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', error: 'Неавторизован' });
  }
};

module.exports = { authenticate };