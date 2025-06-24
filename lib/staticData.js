const bcrypt = require('bcryptjs');
const validator = require('validator');

// Static user data
const users = [
  {
    _id: '1',
    email: 'user@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGOaX8bqTcQaKGKm', // hashed 'password123'
    name: 'John Doe',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    _id: '2',
    email: 'admin@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGOaX8bqTcQaKGKm', // hashed 'password123'
    name: 'Admin User',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// User operations
const findUserByEmail = (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const createUser = async (userData) => {
  const { email, password, name } = userData;
  
  // Validate email
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email address');
  }
  
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create new user
  const newUser = {
    _id: (users.length + 1).toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const userToJSON = (user) => {
  const userObject = { ...user };
  delete userObject.password;
  return userObject;
};

module.exports = {
  findUserByEmail,
  createUser,
  comparePassword,
  userToJSON,
  users
};