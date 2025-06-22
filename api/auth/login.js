const { connectDB } = require('../../lib/db');
const User = require('../../lib/models/User');
const { generateToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};