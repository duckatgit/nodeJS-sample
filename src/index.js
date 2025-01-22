const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/index.routes");
const dbConnect = require("./database/connection/dbconnect");
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;
const host = process.env.HOST || "localhost";
const scheme = process.env.SCHEME || "http";
const mongoUri = process.env.DB || "";


app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(port, async () => {
    await dbConnect(mongoUri);
    console.log(`[server]: Server is running at ${scheme}://${host}:${port}`);
});