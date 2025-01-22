const express = require('express');
const pingRouter = require("./ping.routes");
const authRouter = require('./auth.routes');

const router = express.Router()

router.use("/v1", pingRouter);
router.use("/v1/auth", authRouter)

module.exports = router;