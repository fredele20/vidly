const winston = require('winston')
const express = require("express");
const app = express();

require('./startup/errLoggin')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`app listening on port ${port}...`));

module.exports = server;