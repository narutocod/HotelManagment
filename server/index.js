const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const roomRoutes = require("./routes/rooms");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', // Use environment variable or allow all origins fallback
};
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use("/api/rooms", roomRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Hotel Booking API is running" });
});

// ✅ Serve React build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler (only for API, not frontend routes)
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Hotel Booking Server running on port ${PORT}`);
});
