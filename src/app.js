const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

require('./database/db');

// Routers
const diskUpload = require('./router/diskUpload');
const mongoUpload = require('./router/mongoUpload');

const app = express();

app.use(cors());
app.use(helmet());

// Installing the routers
app.use('/disk', diskUpload);
app.use('/mongo', mongoUpload);

app.get('/', (req, res) => {
  res.send({
    message: "How's it going Shreyash ??",
  });
});

module.exports = app;
