// Create a token (during login)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Verify a token (for protected routes)
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);  
    return decoded;
  } catch (error) {
    return null;  
  }
};

module.exports = { generateToken, verifyToken };
