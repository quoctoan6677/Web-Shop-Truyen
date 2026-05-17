const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

function buildAuthResponse(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  const { fullName, email, password, phone, address } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "fullName, email and password are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone ? phone.trim() : "",
    address: address ? address.trim() : "",
    role: "user",
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return res.status(201).json({
    message: "Register successfully.",
    token,
    user: buildAuthResponse(user),
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      message: "Account has been disabled.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return res.status(200).json({
    message: "Login successfully.",
    token,
    user: buildAuthResponse(user),
  });
}

async function getMe(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}

async function logout(req, res) {
  return res.status(200).json({
    message: "Logout successfully.",
  });
}

module.exports = {
  register,
  login,
  getMe,
  logout,
};
