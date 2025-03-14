const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "username must be filled"],
    minlength: [3, "username minimal 3 karakter"],
  },
  email: {
    type: String,
    required: [true, "email must be filled"],
    validate: {
      validator: validator.isEmail,
      message: "input must be valid format email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [
      function () {
        return !this.is_oauth;
      },
      "passsword must be filled",
    ],
    minlength: [6, "password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  EmailVerifiedAt: {
    type: Date,
  },
  is_oauth: {
    type: Boolean,
    default: false,
  },
  picture: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  if (this.password && !this.is_oauth) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
