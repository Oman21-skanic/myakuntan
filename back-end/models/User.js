const mongoose = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'username must be filled'],
    minlength: [3, 'username minimal 3 karakter'],
  },
  email: {
    type: String,
    required: [true, 'email must be filled'],
    validate: {
      validator: validator.isEmail,
      message: 'input must be valid format email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [
      function() {
        return !this.is_oauth;
      },
      'passsword must be filled',
    ],
    minlength: [6, 'password minimal 6 karakter'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {type: Boolean, default: false},
  is_oauth: {type: Boolean, default: false},
  picture: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  otp: {type: String},
  otpExpires: {type: Date},
  ledgerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Ledger'},
  ledgerName: {type: String},
});

// method untuk compare passsword
userSchema.methods.comparePassword = async function(reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
