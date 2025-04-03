require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db.js") 
const authRoutes = require("./routes/auth.js")

connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:3000", 
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],  
  credentials: true,
}));

app.use("/api/auth", authRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
