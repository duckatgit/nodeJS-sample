const mongoose = require("mongoose");

const FoldersSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bucket_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        nominee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        folder_name: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Folders", FoldersSchema);
