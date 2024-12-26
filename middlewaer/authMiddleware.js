const { verifyToken } = require('../helpers/auth');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = verifyToken(token.split(' ')[1]);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).send('Forbidden');
  next();
};

module.exports = { authenticate, authorize };
