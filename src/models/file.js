const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileBuffer: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  rid: {
    type: String,
    required: true,
    unique: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: '360 days',
    },
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
