const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  sentAt: { type: Date, default: Date.now },
  text: { type: String, required: true },
  readAt: { type: Date }
});

const ChatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  messages: [MessageSchema]
});

module.exports = mongoose.model('Chat', ChatSchema);