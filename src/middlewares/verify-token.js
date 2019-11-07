const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = async function(req, res, next) {
  const token = req.headers.Authorization;

  if (token) {
    const decodedToken = jwt.verify(token, keys.secretKey);

    if (decodedToken) {
      req.locals = {
        tokenInfo: { ...decodedToken }
      };

      next();
    }
  } else {
    return res.status(401).json({ redirect: true });
  }
};
