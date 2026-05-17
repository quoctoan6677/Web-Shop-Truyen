const jwt = require("jsonwebtoken");

function generateToken(payload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in src/.env");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}

module.exports = generateToken;
