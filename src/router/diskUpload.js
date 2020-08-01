const path = require('path');
const fs = require('fs');

const express = require('express');
const shortid = require('shortid');
const multer = require('multer');

const getResourceId = require('../utils/getResourceId');

const router = new express.Router();

// Disk-Storage Configuration for Multer
const storage = multer.diskStorage({
  filename(req, file, callback) {
    const rid = shortid.generate();
    req.rid = rid;
    callback(null, `${rid}-${file.originalname}`);
  },
  destination: 'uploadedFiles/',
});

// Multer Configuration
const multerConfig = multer({
  limits: {
    fileSize: 1500000, // 1.5MB limit for file uploads
  },
  storage: storage,
});

// This route handles single file uploads
router.post(
  '/upload/one',
  multerConfig.single('my-file'),
  (req, res) => {
    // console.log(req.file);
    res.status(201).send({
      message: `File upload successful. Received ${req.file.originalname} of size ${req.file.size} Bytes and Type = ${req.file.mimetype}`,
      rid: req.file.filename,
    });
  },
  (err, req, res, next) => {
    res.status(500).send({
      error: err.message,
    });
  }
);

// GET a resource (file) by providing resource-id (rid)
router.get('/download/:id', (req, res) => {
  try {
    const id = req.params.id;
    const rid = getResourceId(id);
    const valid = shortid.isValid(rid);
    if (!valid) throw new Error('Invalid rid provided');

    const filePath = path.join(__dirname, '../../uploadedFiles/', `${id}`);
    const exists = fs.existsSync(filePath);

    if (!exists) {
      return res.status(404).send({
        error: 'Resource Not Found',
      });
    }

    res.sendFile(filePath);
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});

// [TODO] A route that handles multiple file uploads [i.e. Array uploads]

module.exports = router;
