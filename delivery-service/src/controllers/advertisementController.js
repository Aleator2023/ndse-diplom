const Advertisement = require('../models/Advertisement');

const getAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({ isDeleted: false }).populate('userId', 'name');
    res.json({ status: 'ok', data: advertisements });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

const getAdvertisementById = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id).populate('userId', 'name');
    if (!advertisement || advertisement.isDeleted) {
      return res.status(404).json({ status: 'error', error: 'Объявление не найдено' });
    }
    res.json({ status: 'ok', data: advertisement });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

const createAdvertisement = async (req, res) => {
    try {
      console.log("Creating advertisement");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      console.log("Authenticated user:", req.user);
  
      const { shortTitle, description } = req.body;
      const images = req.files.map(file => file.path);
      const advertisement = new Advertisement({
        shortText: shortTitle,
        description,
        images,
        userId: req.user.id 
      });
      await advertisement.save();
      res.status(201).json({ status: 'ok', data: advertisement });
    } catch (error) {
      console.error("Error creating advertisement:", error);
      res.status(400).json({ status: 'error', error: error.message });
    }
  };
  const deleteAdvertisement = async (req, res) => {
    try {
      console.log("Deleting advertisement with ID:", req.params.id);
      console.log("Authenticated user:", req.user);
  
      if (!req.user || !req.user._id) {
        console.log("User is not authenticated");
        return res.status(401).json({ status: 'error', error: 'Unauthorized' });
      }
  
      const advertisement = await Advertisement.findById(req.params.id);
      if (!advertisement || advertisement.isDeleted) {
        console.log("Advertisement not found or already deleted");
        return res.status(404).json({ status: 'error', error: 'Объявление не найдено' });
      }
  
      console.log("Advertisement userId:", advertisement.userId.toString());
      console.log("Request userId:", req.user._id.toString());
  
      if (advertisement.userId.toString() !== req.user._id.toString()) {
        console.log("User does not have permission to delete this advertisement");
        return res.status(403).json({ status: 'error', error: 'Недостаточно прав' });
      }
  
      advertisement.isDeleted = true;
      await advertisement.save();
      console.log("Advertisement successfully deleted");
      res.json({ status: 'ok', data: advertisement });
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      res.status(500).json({ status: 'error', error: error.message });
    }
  };
  
module.exports = { getAdvertisements, getAdvertisementById, createAdvertisement, deleteAdvertisement };