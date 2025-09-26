const mongoose = require("mongoose");
const User = require("../models/User");
require('dotenv').config();  //load environment variables from .env file

// Sample users to insert
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // will be hashed by pre-save hook
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
  },
];

const seedUsers = async () => {
  try {
    // ✅ Connect to DB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected...");

    // ❌ Clear existing users (optional, to avoid duplicates)
    await User.deleteMany();
    console.log("🗑️ Users collection cleared.");

    for (const user of users) {
        await User.create(user);
      }
      
    // ✅ Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    mongoose.connection.close();
  }
};

seedUsers();
