const User = require("../../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.password.trim() !== password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "secretKey"
      // { expiresIn: "1h" }
    );
    console.log(token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { login };
