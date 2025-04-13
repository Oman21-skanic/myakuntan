const {
  RateLimiterRedis,
  RateLimiterMemory,
} = require('rate-limiter-flexible');
const redis = require('redis');
require('dotenv').config();

// Buat koneksi Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

// Handle error koneksi
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
  // Fallback ke memory limiter jika Redis down
});

// Fungsi untuk membuat limiter dengan fallback
const createLimiter = (points, duration, keyPrefix) => {
  try {
    return new RateLimiterRedis({
      storeClient: redisClient,
      points,
      duration,
      keyPrefix,
    });
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    console.warn('Using memory limiter as fallback');
    return new RateLimiterMemory({points, duration});
  }
};

// Rate limiter untuk endpoint auth (lebih ketat)
const authLimiter = createLimiter(10, 15 * 60, 'auth_limit'); // 10 request per 15 menit

// Rate limiter untuk API umum
const apiLimiter = createLimiter(100, 15 * 60, 'api_limit'); // 100 request per 15 menit

// Rate limiter berbasis user
const userLimiter = createLimiter(500, 24 * 60 * 60, 'user_limit'); // 500 request per hari

// Middleware untuk Express
const wrapLimiter = (limiter) => async (req, res, next) => {
  try {
    const key = req.user?._id || req.ip; // Gunakan user ID jika ada, atau IP
    await limiter.consume(key);
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (rejRes) {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later',
    });
  }
};

module.exports = {
  authLimiter: wrapLimiter(authLimiter),
  apiLimiter: wrapLimiter(apiLimiter),
  userLimiter: wrapLimiter(userLimiter),
  redisClient, // Export untuk koneksi di server.js
};
