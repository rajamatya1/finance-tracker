const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");

const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");

function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());

  app.use("/api/transactions", transactionRoutes);
  app.use("/api/auth", authRoutes);

  app.get("/", (req, res) => {
    res.json({ message: "Finance Tracker API is running..." });
  });

  return app;
}

module.exports = createApp;
