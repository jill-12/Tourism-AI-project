// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      res.status(401).send({ error: 'Please authenticate' });
    }
  }
};