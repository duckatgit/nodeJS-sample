const mongoose = require("mongoose");

const roleenum = ["Spouse", "Civil Partner", "Girlfriend", "Boyfriend", "Daughter", "Son",
    "Father", "Mother", "Sister", "Brother", "Friend", "Father in law", "Mother in law", "Sister in law", "Brother in law", "Lawyer", "Doctor"];

const NomineeSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        role: { type: String, required: true, enum: roleenum },
        email: { type: String, required: true },
        background_color: { type: String, required: true },
        role_color: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Nominee", NomineeSchema);
