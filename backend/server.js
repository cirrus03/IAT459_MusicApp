
require("dotenv").config();

// server.js
const express = require('express');
const cors = require('cors'); // Import the CORS package
const mongoose = require("mongoose"); //for database

//routes
// const songRoutes = require("./routes/songs");

const app = express();
const PORT = 5000;

// Middleware to parse JSON 
app.use(express.json());

// Enable CORS: Allow requests specifically from your React Frontend
app.use(cors({
  origin: 'http://localhost:3000'
}));


//database connection
const uri = process.env.MONGO_URI;
console.log(uri);

const clientOptions = {
    serverApi: { version: "1", 
            strict: true,
            depreciationErrors: true
    },
};

//function to connect to db
async function connectDB() {
    try {
        await mongoose.connect(uri, clientOptions);
        //test with ping
        console.log("✅ Pinged the db. You successfully connected to MongoDB!");
        
    } catch (err) {
        console.error("❌ Connection failed:", err);
        process.exit(1); //stop server if error
    }
}


//execute connection to db
connectDB();


// A test route
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from the Node backend!" });
});

//songs route
// app.use('/api/songs', songRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});