const Chat = require('../models/Chat');

const getChat = async (req, res) => {
  const { users } = req.body;
  const chat = await Chat.findOne({ users: { $all: users } });
  res.json({ status: 'ok', data: chat });
};

const sendMessage = async (req, res) => {
  const { author, receiver, text } = req.body;
  let chat = await Chat.findOne({ users: { $all: [author, receiver] } });
  if (!chat) {
    chat = new Chat({ users: [author, receiver] });
  }
  chat.messages.push({ author, text });
  await chat.save();
  res.json({ status: 'ok', data: chat });
};

module.exports = { getChat, sendMessage };