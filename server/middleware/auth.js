// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // <-- Import User model

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ msg: 'Token is not valid' });

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Admin-only middleware
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
};

module.exports = { auth, adminAuth };
