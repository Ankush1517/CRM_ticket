const express = require('express');
const { raiseTicket, viewTickets, deleteTicket, getTicketsByStatus } = require('../controllers/ticketController');
const { updateTicketStatus } = require('../controllers/ticketController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.post('/raise', authenticateJWT, raiseTicket);
router.get('/view', authenticateJWT, viewTickets);
router.put('/update-status', authenticateJWT, updateTicketStatus);
router.delete('/delete/:ticket_id', authenticateJWT, deleteTicket);

//new route
router.get('/status/:status', authenticateJWT, getTicketsByStatus);
//
module.exports = router;
