const express = require('express');

const userController = require('../controllers/user');
const {authenticateUser} = require('../middlewares/auth');

const router = express.Router();

router.post('/signup',userController.signUp);
router.post('/login',userController.logIn);

router.get('/profile', authenticateUser , userController.getProfile);
router.put('/profile', authenticateUser , userController.updateProfile);
router.delete('/profile', authenticateUser , userController.deleteProfile);

module.exports = router;