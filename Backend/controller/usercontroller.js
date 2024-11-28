const User = require('../models/user'); // Path to User model
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TaskMaster.suhel'; // Use an environment variable for production

// Signup Controller
exports.signin = async (req, res) => {
  const { Username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists'});

    // Create a new user
    const user = new User({ Username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' ,userData:user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token ,userData:user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
