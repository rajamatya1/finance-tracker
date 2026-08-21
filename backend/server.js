const mongoose = require("mongoose");
const createApp = require("./app");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = createApp();

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
