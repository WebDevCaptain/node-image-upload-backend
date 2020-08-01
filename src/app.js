const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routers
const diskUpload = require('./router/diskUpload');

const app = express();

app.use(cors());
app.use(helmet());

// Installing the routers
app.use('/disk', diskUpload);

app.get('/', (req, res) => {
  res.send({
    message: "How's it going Shreyash ??",
  });
});

module.exports = app;
