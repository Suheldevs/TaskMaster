const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Password verification
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare provided password with hashed password
};

const User = mongoose.model('User', userSchema);
module.exports = User;
