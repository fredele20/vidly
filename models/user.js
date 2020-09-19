const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

// Schema type for creating a user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
  },
  isAdmin: Boolean,
});

// This function is used to generate token for user.
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

// Model type for creating a user
const User = mongoose.model("User", userSchema);

// Validation for user registration
function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
  };
  return Joi.validate(user, schema);
}

// Validation for login registration
function validateLogin(login) {
  const schema = {
    password: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
  };
  return Joi.validate(login, schema);
}

exports.validateLogin = validateLogin;
exports.User = User;
exports.validate = validateUser;
