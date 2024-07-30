const express = require('express');
const multer = require('multer');
const upload = multer();
const { importCustomers } = require('../controllers/importController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.post('/import', authenticateJWT, upload.single('file'), importCustomers);

module.exports = router;
