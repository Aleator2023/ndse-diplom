const Advertisement = require('../models/Advertisement');

const getAdvertisements = async (req, res) => {
  const advertisements = await Advertisement.find({ isDeleted: false }).populate('userId', 'name');
  res.json({ status: 'ok', data: advertisements });
};

const getAdvertisementById = async (req, res) => {
  const advertisement = await Advertisement.findById(req.params.id).populate('userId', 'name');
  if (!advertisement || advertisement.isDeleted) {
    return res.status(404).json({ status: 'error', error: 'Объявление не найдено' });
  }
  res.json({ status: 'ok', data: advertisement });
};

const createAdvertisement = async (req, res) => {
  const { shortText, description, tags } = req.body;
  const images = req.files.map(file => file.path);
  const advertisement = new Advertisement({ shortText, description, images, tags, userId: req.user._id });
  await advertisement.save();
  res.status(201).json({ status: 'ok', data: advertisement });
};

const deleteAdvertisement = async (req, res) => {
  const advertisement = await Advertisement.findById(req.params.id);
  if (!advertisement || advertisement.isDeleted) {
    return res.status(404).json({ status: 'error', error: 'Объявление не найдено' });
  }
  if (advertisement.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ status: 'error', error: 'Недостаточно прав' });
  }
  advertisement.isDeleted = true;
  await advertisement.save();
  res.json({ status: 'ok', data: advertisement });
};

module.exports = { getAdvertisements, getAdvertisementById, createAdvertisement, deleteAdvertisement };