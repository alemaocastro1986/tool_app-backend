export default {
  secret: process.env.AUTH_SECRET,
  salt: 8,
  expiresIn: '30d',
};
