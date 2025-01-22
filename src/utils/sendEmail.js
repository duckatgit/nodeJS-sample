const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });

        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;