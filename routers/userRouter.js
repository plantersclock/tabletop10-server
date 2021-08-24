const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { get } = require("mongoose");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    // get user account

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(401).json({
        errorMessage: "Wrong email or password",
      });

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!correctPassword)
      return res.status(401).json({
        errorMessage: "Wrong email or password",
      });

    // sign the token

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    // validation

    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (password.length < 8)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 8 characters",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Passwords do not match",
      });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists",
      });

    // hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save a new user account to the db

    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // sign the token

    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/logOut", (req, res) => {
  try {
    res.clearCookie("token").send();
  } catch (error) {
    return res.json(null);
  }
});

router.get("/loggedIn", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(null);

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: validatedUser.user });

    res.json({ email: user.email, id: user._id });
  } catch (error) {
    return res.json(null);
  }
});

module.exports = router;
