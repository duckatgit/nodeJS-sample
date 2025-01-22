
const pingService = () => {
    try {
        let result = {
            status: 200,
            success: true,
            message: "pinging"
        }
        return result
    }
    catch (err) {
        let result = {
            status: 500,
            success: false,
            message: "Network Error"
        }
        return result
    }
}

module.exports = pingService