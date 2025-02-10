const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  userType: {
    type: Number,
    required: [true, "Please provide user type number"],
    enum: [1, 2],
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  track: {
    type: String,
    required: [true, "Please provide track"],
    minlength: 2,
    maxlength: 75,
  },
  phoneNumber: {
    type: Number,
    maxlength: 10,
  },
  nationalId: {
    type: Number,
    required: [true, "Please provide national ID"],
    maxlength: 10,
    unique: true,
  },
  gender: {
    type: String,
    maxlength: 10,
  },
  major: {
    type: String,
    maxlength: 125,
  },
  hasSubmittedForm: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      userType: this.userType,
      track: this.track
    },
    process.env.JWT_SECRET_USER,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
