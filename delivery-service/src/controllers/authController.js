// Регистрация пользователя
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password, name, contactPhone } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, name, contactPhone });
    await user.save();
    res.status(201).json({ status: 'ok', data: { id: user._id, email, name, contactPhone } });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// Аутентификация пользователя
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(400).json({ status: 'error', error: 'Неверный логин или пароль' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ status: 'ok', data: { id: user._id, email, name: user.name, contactPhone: user.contactPhone, token } });
    } catch (error) {
      res.status(400).json({ status: 'error', error: error.message });
    }
  };
  
  module.exports = { register, login };