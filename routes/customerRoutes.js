const express = require('express');
const { createCustomer, getCustomerDetails } = require('../controllers/customerController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');


// Route to get customer details
router.get('/details', authenticateJWT, getCustomerDetails);

router.post('/create', authenticateJWT, createCustomer);

module.exports = router;
