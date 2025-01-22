const mongoose = require('mongoose');

const dbConnect = async (uri) => {
    if (!uri) {
        throw new Error("MongoDB URI is required");
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
            console.log("Successfully connected to MongoDB");

            mongoose.connection.on("error", (error) => {
                console.error("Mongoose connection error:", error);
            });

            mongoose.connection.on("disconnected", () => {
                console.log("Mongoose disconnected from the database");
            });

            process.on("SIGINT", async () => {
                await mongoose.connection.close();
                console.log("Mongoose connection closed due to application termination");
                process.exit(0);
            });
        }
    } catch (error) {
        console.error("Error during MongoDB connection:", error);
        throw error; // Rethrow the error to handle it in the server initialization
    }
}

module.exports = dbConnect;