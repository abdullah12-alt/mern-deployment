require('dotenv').config();  //load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');


const app = express();


//middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "http://ec2-16-171-132-75.eu-north-1.compute.amazonaws.com", 
    "http://16.171.132.75",
    "http://localhost:3000"  // for local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Routes
app.use('/api/users', require('./routes/user'));

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log('MongoDB connected successfully!');
        
        // Seed users after successful DB connection
        await seedUsers();
    }
    catch  (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Function to seed users
const seedUsers = async () => {
    try {
        // Check if users already exist
        const userCount = await User.countDocuments();
        
        if (userCount > 0) {
            console.log('Users already exist in database. Skipping seeding.');
            return;
        }

        // Default users to seed
        const defaultUsers = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
                isActive: true
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'user123',
                role: 'user',
                isActive: true
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'user123',
                role: 'user',
                isActive: true
            },
            {
                name: 'Bob Wilson',
                email: 'bob@example.com',
                password: 'user123',
                role: 'user',
                isActive: false
            }
        ];

        // Create users
        const createdUsers = await User.create(defaultUsers);
        console.log(`Successfully seeded ${createdUsers.length} users to the database.`);
        
        console.log('Seeded users:');
        createdUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Role: ${user.role}, Active: ${user.isActive}`);
        });
        
    } catch (error) {
        console.error('Error seeding users:', error);
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