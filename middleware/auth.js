const jwt = require("jsonwebtoken");
const config = require("config");
// const User = require('../models/user')

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. no token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

function admin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send("Access denied. Forbidden");
  next();
}

exports.admin = admin;
exports.auth = auth;
