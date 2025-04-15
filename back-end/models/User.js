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
  is_verified: {type: Boolean, default: false},
  is_oauth: {type: Boolean, default: false},
  picture: {type: String},
  otp: {type: String},
  otpExpires: {type: Date},
  bidang_usaha: {
    type: String,
    enum: ['Manufaktur', 'Jasa', 'Perdagangan'],
  },
  nama_usaha: {
    type: String,
    maxlength: [100, 'terlalu panjang maksmial 100 karakter.'],
  },
  alamat: {
    type: String,
    maxlength: [256, 'terlalu panjang maksimal 256 karakter.'],
  },
}, {timestamps: true});

// method untuk compare passsword
userSchema.methods.comparePassword = async function(reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
