const express = require('express');
const { generateReport } = require('../controllers/reportController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.get('/generate', authenticateJWT, generateReport);

module.exports = router;
