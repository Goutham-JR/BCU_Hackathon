require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db.js") 
const authRoutes = require("./routes/auth.js")
const donateRoutes = require("./routes/donate.js")

const path = require('path');

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
app.use("/uploads", express.static("uploads"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/donate", donateRoutes);



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
