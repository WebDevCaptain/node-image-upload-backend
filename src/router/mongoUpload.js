const multer = require('multer');
const express = require('express');
const shortid = require('shortid');
const sharp = require('sharp');

const FileModel = require('../models/file');

const router = new express.Router();

const multerConfig = multer({
  limits: {
    fileSize: 3000000,
  },
});

// POST: Upload a single file
router.post(
  '/upload/one',
  multerConfig.single('my-file'),
  async (req, res) => {
    const rid = shortid.generate();

    try {
      let resizedImage = req.file.buffer;
      let mimeType = req.file.mimetype;

      if (/(png)|(jpg)|(jpeg)/.test(req.file.mimetype)) {
        resizedImage = await sharp(req.file.buffer)
          .resize(300, 300)
          .png()
          .toBuffer();

        mimeType = 'image/png';

        console.log('Resizing...');
      }

      const file = new FileModel({
        fileBuffer: resizedImage,
        rid: rid,
        contentType: mimeType,
      });

      file.save();

      res.send({
        message: `File ${req.file.originalname} uploaded successfully.`,
        rid: rid,
      });
    } catch (err) {
      res.status(500).send({
        message: 'File upload failed. Try again later',
      });
    }
  },
  (err, req, res, next) => {
    if (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

// GET a single file
router.get('/download/:id', async (req, res) => {
  try {
    const rid = req.params.id;
    if (!shortid.isValid(rid)) throw new Error('Invalid rid provided');

    const file = await FileModel.findOne({
      rid: rid,
    });

    if (!file) {
      return res.status(404).send({
        error: 'File not Found',
      });
    }

    res.set('Content-Type', file.contentType);
    res.send(file.fileBuffer);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

module.exports = router;
