const express = require('express');
const { raiseTicket, viewTickets, deleteTicket, getTicketsByStatus } = require('../controllers/ticketController');
const { updateTicketStatus, reopenTicket,rateTicket, getTicketById, changePassword } = require('../controllers/ticketController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.post('/raise', authenticateJWT, raiseTicket);
router.get('/view', authenticateJWT, viewTickets);
router.put('/update-status', authenticateJWT, updateTicketStatus);
router.delete('/delete/:ticket_id', authenticateJWT, deleteTicket);

//new route
router.get('/status/:status', authenticateJWT, getTicketsByStatus);
//more routes

// Route to reopen a closed ticket
router.put('/reopen/:ticket_id', authenticateJWT, reopenTicket);

// Route to rate a closed ticket
router.put('/rate/:ticket_id', authenticateJWT, rateTicket);

router.get('/:ticket_id', authenticateJWT, getTicketById);

//changing password 
router.patch('/change-password', authenticateJWT, changePassword);


module.exports = router;
