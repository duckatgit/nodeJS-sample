const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
        password: { type: String },
        phone: { type: String, required: true },
        provider: { type: String, required: true, default: "on-premise", enum: ["on-premise", "google", "linkedin", "instagram"] },
        image: { type: String },
        otp: { type: String, required: true },
        verified: { type: String, required: true, default: false },
        resetPasswordToken: { type: String }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
