const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Schema: Defines structure and validation

const userSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true, // Remove whitespace
            minlength: [2, 'Name must be at least 2 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true, // No duplicate emails
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // Only these roles
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true
    }

);
userSchema.pre('save',
    async function (next) {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 12)
        next();
    }
)

// Method: Compare password for login (we'll use this later)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);