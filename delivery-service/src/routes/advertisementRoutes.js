const express = require('express');
const router = express.Router();
const { getAdvertisements, getAdvertisementById, createAdvertisement, deleteAdvertisement } = require('../controllers/advertisementController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authenticate } = require('../middleware/authMiddleware');

router.get('/advertisements', getAdvertisements);
router.get('/advertisements/:id', getAdvertisementById);
router.post('/advertisements', authenticate, upload.array('images'), createAdvertisement);
router.delete('/advertisements/:id', authenticate, deleteAdvertisement);

module.exports = router;