// routes/users.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper for building query (search, filter)
const buildQuery = (req) => {
  let query = {};
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } }, 
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.role) query.role = req.query.role;
  if (req.query.active !== undefined) query.isActive = req.query.active === 'true';
  return query;
};

// Helper for pagination and sort
const getPaginationSort = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort ? { [req.query.sort.split(':')[0]]: req.query.sort.split(':')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 };
  return { skip, limit, sort };
};

// @route   POST api/users
// @desc    Create a user (public for signup, but we'll restrict later)
// @access  Public (for now; add auth if needed)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, role: role || 'user' });
    await user.save();

    // Generate JWT (for login response; we'll add full login later)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// @route   GET api/users
// @desc    Get all users with search/filter/sort/paginate
// @access  Private/Admin
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const query = buildQuery(req);
    const { skip, limit, sort } = getPaginationSort(req);

    const users = await User.find(query)
      .select('-password') // Hide password
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query); // For pagination info

    res.json({
      users,
      pagination: { current: parseInt(req.query.page) || 1, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// @route   PUT api/users/:id
// @desc    Update user (edit fields or toggle active)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      // Re-hash if password updated
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    let user = await User.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: Date.now() }, // Spread updates
      { new: true, runValidators: true } // Return updated doc, validate
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/users/login
// @desc    Login user and return token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;