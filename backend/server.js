const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running..." });
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected 🔥");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();