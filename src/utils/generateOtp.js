const generateOTP = () => {
    // Generate a random number between 100 and 999
    const otp = Math.floor(100 + Math.random() * 900);
    return otp;
}

module.exports = generateOTP;