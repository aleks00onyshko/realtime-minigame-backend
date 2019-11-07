const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes');
const config = require('./config/dev');
const keys = require('./config/keys');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);
app.use(function(err, req, res, next) {
  res.status(500).send({ message: 'Something broke!', err });
});

mongoose
  .connect(keys.mongoDbUrl, { useNewUrlParser: true })
  .then(() => console.log('Connected to the [Mongo DB]'))
  .catch(err => console.log(`Error ${err}`));

app.listen(config.port, () => console.log(`Server is listening on the port ${config.port}`));
