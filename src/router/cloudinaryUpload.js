const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');

const CloudImage = require('../models/cloudinary-img');

const router = new express.Router();

// NOTE: Logic for uploading files is restricted to images for now, refactor in future

// Cloudinary Secrets from Environment Variables
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'my-files',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'bmp'],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: 'limit',
      },
    ],
  },
});

const multerConfig = multer({
  storage,
});

router.post(
  '/upload/one',
  multerConfig.single('my-file'),
  async (req, res) => {
    const publicId = req.file.filename;
    const url = req.file.path;

    try {
      const img = new CloudImage({
        public_id: publicId,
        url,
      });

      await img.save();

      res.send({
        message: `Uploaded ${req.file.originalname} successfully`,
        url,
      });
    } catch (err) {
      res.status(500).send({
        error: err.message,
      });
    }
  },
  (err, req, res, next) => {
    if (err) {
      res.status(400).send({
        error: err.message,
      });
    }
  }
);

module.exports = router;
