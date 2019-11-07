const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true }
});

class User {
  generateAccessToken() {
    return jwt.sign(
      { _id: this._id, email: this.email, username: this.username },
      keys.accessTokenSecret,
      { expiresIn: '3h' }
    );
  }

  async isPasswordValid(password) {
    return await bcrypt.compare(password, this.password);
  }

  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
  }
}

userSchema.loadClass(User);

module.exports = mongoose.model('users', userSchema);
