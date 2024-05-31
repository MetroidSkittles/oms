const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch {
    return res.sendStatus(401);
  }
}

module.exports = authMiddleware;