const mongoose = require("mongoose");

const BucketsSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bucket_name: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Buckets", BucketsSchema);
