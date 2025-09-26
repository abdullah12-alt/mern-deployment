require('dotenv').config();  //load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();


//middlewares
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/users', require('./routes/user'));

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log('MongoDB connected successfully!');
    }
    catch  (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

// Basic route to test server
app.get('/',(req,res)=>{
    res.send("Backend is running!");
})

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});