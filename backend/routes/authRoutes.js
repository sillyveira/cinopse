const express = require('express');
const { googleCallback, verifyAuth, logout, silveiraLogin } = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/google/callback', googleCallback);
router.get('/silveira', silveiraLogin);
router.get('/verify', authMiddleware, verifyAuth);
router.post('/logout', logout);

module.exports = router;