const pingService = require("../services/ping.service");

const pingController = async (req, res) => {
    try {
        const pingServiceFunc = pingService()
        res.status(pingServiceFunc?.status).json(pingServiceFunc)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = pingController