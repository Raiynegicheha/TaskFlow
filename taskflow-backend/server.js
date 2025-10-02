// Import required packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Test = require("./src/models/Test");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
const connectDB = require("./src/config/database");
connectDB();

// Create Express app
const app = express();

// Middleware - functions that run before routes
app.use(cors()); // Allow cross-origin requests (frontend can talk to backend)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test route - this is an API endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 TaskFlow API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Server is running smoothly",
    uptime: process.uptime(),
  });
});

// Test endpoint that echoes back what you send
app.post("/api/test", (req, res) => {
  res.json({
    message: "Received your data!",
    receivedData: req.body,
  });
});

// Endpoint to create a new Test document in MongoDB
app.post("/api/db-test", async (req, res) => {
  try {
    const { name, message } = req.body;

    // Create new document
    const testDoc = new Test({ name, message });

    // Save to database
    await testDoc.save();

    res.json({
      success: true,
      message: "Test document created successfully",
      data: testDoc,
    });
  } catch (error) {
    console.error("Error creating Test document:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

// Test database read
app.get("/api/db-test", async (req, res) => {
  try {
    const allTests = await Test.find();

    res.json({
      success: true,
      count: allTests.length,
      data: allTests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading from database",
      error: error.message,
    });
  }
});


//API Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
// app.use("/api/users", require("./src/routes/userRoutes"));
// app.use("/api/projects", require("./src/routes/projectRoutes"));
// app.use("/api/tasks", require("./src/routes/taskRoutes"));


// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler - must be defined after all other app.use() and routes calls
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ success: false, message: "Server Error", error: err.message });
});


// Get port from environment or use 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
});
