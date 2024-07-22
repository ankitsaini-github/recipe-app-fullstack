const express = require('express');

const adminController = require('../controllers/admin');
const {authenticateAdmin} = require('../middlewares/auth');

const router = express.Router();

router.get('/all-data', authenticateAdmin , adminController.getAllData);
router.post('/add-admin', authenticateAdmin , adminController.addAdmin);

module.exports = router;