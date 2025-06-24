const { createUser, userToJSON } = require('../../lib/staticData');
const { generateToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    const user = await createUser({ email, password, name });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: userToJSON(user),
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message === 'Invalid email address') {
      return res.status(400).json({ 
        error: 'Invalid email address'
      });
    }
    
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};