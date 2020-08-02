const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model('CloudinaryImage', ImageSchema);

module.exports = Image;
