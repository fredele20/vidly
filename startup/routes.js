const express = require('express')
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const user = require("../routes/users");
const rentals = require('../routes/rentals')
const returns = require('../routes/returns')
const movies = require('../routes/movies')
const error = require("../middleware/errors");

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/genres", genres);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies)
    app.use('/api/rentals', rentals)
    app.use("/api/users", user);
    app.use('/api/returns', returns)
    app.use(error);
}