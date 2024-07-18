const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAdvertisements, getAdvertisementById, createAdvertisement, deleteAdvertisement } = require('../controllers/advertisementController');
const { authenticate } = require('../middleware/authMiddleware');

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

  router.get('/advertisements', (req, res) => {
    console.log("GET /advertisements");
    getAdvertisements(req, res);
  });
  router.get('/advertisements/:id', (req, res) => {
    console.log(`GET /advertisements/${req.params.id}`);
    getAdvertisementById(req, res);
  });
  router.post('/advertisements', authenticate, upload.array('images'), (req, res) => {
    console.log("POST /advertisements");
    console.log(req.body);
    console.log(req.files);
    createAdvertisement(req, res);
  });
  router.delete('/advertisements/:id', authenticate, (req, res) => {
    console.log(`DELETE /advertisements/${req.params.id}`);
    deleteAdvertisement(req, res);
  });
  
module.exports = router;