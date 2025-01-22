const express = require('express');
const pingController = require('../controllers/ping.controller');

const pingRouter = express.Router()

pingRouter.get("/ping", pingController);

module.exports = pingRouter