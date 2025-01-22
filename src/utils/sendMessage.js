const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendMessage = async (to, body) => {
    try {
        const message = await client.messages.create({
            body: body,
            from: process.env.PHONE,
            to: to,
        });

        console.log('Message sent:', message.sid);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

module.exports = sendMessage;
