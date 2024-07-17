const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  shortText: { type: String, required: true },
  description: { type: String },
  images: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [String],
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Advertisement', AdvertisementSchema);