const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/api/signup', authController.signup);
router.post('/api/login', authController.login);
router.get('/api/get-user-data/:user_id', authController.getUserById);

module.exports = router;
