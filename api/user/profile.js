const users = require('../../lib/staticData');
const { authenticateToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  try {
    // await connectDB();

    if (req.method === 'GET') {
      return await getUsers(req, res);
    } else if (req.method === 'PUT') {
      return await updateProfile(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function getUsers(req, res) {
  // Simulate fetching users from a database
  const body =  users.users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));

  res.status(200).json({
    message: 'Users retrieved successfully',
    users: body
  });
}

async function getProfile(req, res) {
  
  const user = await users.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    message: 'Profile retrieved successfully',
    user: user.toJSON()
  });
}

async function updateProfile(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const { name, email } = req.body;

      if (!name && !email) {
        return res.status(400).json({ 
          error: 'At least one field (name or email) is required for update' 
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) {
        const existingUser = await User.findOne({ 
          email, 
          _id: { $ne: req.userId } 
        });
        if (existingUser) {
          return res.status(409).json({ 
            error: 'Email is already in use by another account' 
          });
        }
        updateData.email = email;
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Invalid input data',
          details: Object.values(error.errors).map(e => e.message)
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  });
}