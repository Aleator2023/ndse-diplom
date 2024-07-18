const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log("Token is missing");
    return res.status(401).json({ status: 'error', error: 'Token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }
};

module.exports = { authenticate };