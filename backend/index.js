const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Routes = require("./routes/route.js");
dotenv.config();

const PORT = process.env.PORT || 6234;


// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies or authorization headers
  preflightContinue: false, // Allow the preflight request to finish
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB DataBase"))
  .catch((err) => console.log("💥 NOT CONNECTED TO NETWORK : ", err));

app.use("/", Routes);

// Test an OPTIONS route explicitly if needed
app.options("/AdminReg", cors(corsOptions));  // Handle OPTIONS preflight

app.listen(PORT, () => {
  console.log(`✅ Server started at port no. ${PORT}`);
});
