const { auth } = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate, validateLogin } = require("../models/user");
const express = require("express");
const router = express.Router();

// This route get the current loggin user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
// Register handler to register new User
router.post("/register", async (req, res) => {
  // Validate the request body and return error if any.
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Look out for the user in mongodb and return error if already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("A user with the email already exists");

  // create a new user object instance and the add the required fields
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // Salt and Hash the User password before passing into the database
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Save the user in the database
  user = await user.save();

  // Generate token from request headers
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

// Login handler to login an existing User
router.post("/login", async (req, res) => {
  // Validate the request body and return error if any
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate the email if it is correct and return error if any
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  // Validate the password and return err if there is any.
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // Create and send token upon successful user login
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
