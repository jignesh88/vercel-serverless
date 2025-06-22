# Vercel Serverless Authentication API

A secure serverless authentication API built with Vercel Functions, featuring user registration, login, and profile management with JWT authentication.

## Features

- User registration with email validation
- Secure login with JWT tokens
- User profile management (get/update)
- Password hashing with bcrypt
- MongoDB integration
- Automated deployment with GitHub Actions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile (requires authentication)
- `PUT /api/user/profile` - Update user profile (requires authentication)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### 2. Vercel Configuration

Add these environment variables to your Vercel project:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong secret key for JWT signing

### 3. GitHub Secrets Setup

For automated deployment, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and Variables → Actions
3. Add the following secrets:
   - `VERCEL_TOKEN` - Your Vercel token (get from Vercel account settings)
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID

#### Getting Vercel IDs:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Get your org and project IDs
vercel env ls
```

### 4. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Deployment

The project automatically deploys to Vercel when you push to the main branch. Pull requests create preview deployments.

## Usage Examples

### Register User
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Login
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Get Profile
```bash
curl -X GET https://your-domain.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile
```bash
curl -X PUT https://your-domain.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Updated"
  }'
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token expiration (7 days)
- Email validation
- Input sanitization
- Secure environment variable handling
- MongoDB connection pooling

## Project Structure

```
├── api/
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
│   └── user/
│       └── profile.js
├── lib/
│   ├── models/
│   │   └── User.js
│   ├── auth.js
│   └── db.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vercel.json
└── README.md
```