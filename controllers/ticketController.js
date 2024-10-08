const { where } = require('sequelize');
const { Ticket, Employee, Customer } = require('../models');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const bcrypt = require('bcrypt');

exports.raiseTicket = async (req, res) => {
  const { customer_id, description, type, category } = req.body;
  const ticket_id = uuidv4(); // Generate unique ticket ID

   // Debugging: print the customer_id
   console.log('Received customer_id:', customer_id);
   console.log('hello') ;
   // Ensure the customer_id is parsed correctly
   const parsedCustomerId = parseInt(customer_id, 10);
  
   // Debugging: print the parsed customer_id
   console.log('Parsed customer_id:', parsedCustomerId);

   const allCustomers = await Customer.findAll();
   console.log('All Customers:', allCustomers);
 
   // Find the customer
  
  const employees = await Employee.findAll();
  const employee_id = employees[Math.floor(Math.random() * employees.length)].id;
  
  //console.log('Received customer_id:', customer_id);
  //if()
  
  //const customer = await Customer.findByPk(parsedCustomerId);
   // Find the customer by customer_id instead of id
   const customer = await Customer.findOne({ where: { customer_id: parsedCustomerId } });
  // Debugging: print the customer found
  console.log('Customer found:', customer);
  if (!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }


  const ticket = new Ticket({
    customer_id: parsedCustomerId, employee_id, status: 'Open', type, category, ticket_id, description, created_at: new Date(), raisedBy: customer.name,
  });

  await ticket.save();
  res.status(201).json(ticket);
  //res.status(201).send('Ticket raised');
};

// exports.viewTickets = async (req, res) => {
//   const { role, id } = req.user;

//   if (role === 'customer') {
//     const tickets = await Ticket.findAll({ where: { customer_id: id } });
//     res.json(tickets);
//   } else if (role === 'employee') {
//     const tickets = await Ticket.findAll({ where: { employee_id: id } });
//     res.json(tickets);
//   } else {
//     res.sendStatus(403);
//   }
// };

// const { Ticket } = require('../models');

exports.viewTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'customer') {
      
      /*
      console.log('Customer: ', req.user);*/
      //getting customer name 
      const user= await Customer.findByPk(req.user.id);
      console.log("name of customer: ",user.name);
      tickets = await Ticket.findAll({ where: { customer_id: user.customer_id } });

       

  
    

      //console.log("ticket details", tickets);

    } else if (req.user.role === 'employee') {
      tickets = await Ticket.findAll();
    } else {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    res.status(200).json(tickets);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTicketStatus = async (req, res) => {

  const { ticket_id, status } = req.body;
  //const { ticket_id, status, response, type, category } = req.body;
  const employeeId = req.user.id;

  //getting employee name through employee id
  const user= await Employee.findByPk(req.user.id);
  console.log(user.username);

  try {
    const ticket = await Ticket.findOne({ where: { ticket_id: ticket_id, employee_id: employeeId } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or not assigned to this employee' });
    }

    
    ticket.status = status;
    // /ticket.response = response;
    // ticket.type = type ;
    // ticket.category = category ;
    //adding the name of updater 
    ticket.updatedBy = user.username; 
    console.log(req.user.username) ;
    await ticket.save();

    res.status(200).json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
      const { ticket_id } = req.params;

      /*// Check if the user is an employee
      if (req.user.role !== 'employee') {
          return res.status(403).json({ error: 'Only employees can delete tickets.' });
      }*/

      const ticket = await Ticket.findOne({ where: { ticket_id } });

      if (!ticket) {
          return res.status(404).json({ error: 'Ticket not found.' });
      }

      await ticket.destroy();

      //additional comments 
      console.log('Customer: ', req.user);
      const user= await Customer.findByPk(req.user.id);
      console.log("user found",user);
      tickets = await Ticket.findAll({ where: { customer_id: user.customer_id } });
      
      res.status(200).json(tickets);
      //
     /* res.status(200).json({ message: 'Ticket deleted successfully.' });*/
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the ticket.' });
  }
};

//new one

exports.getTicketsByStatus = async (req, res) => {
  const { status } = req.params;

  try {
      // Validate status
      if (!['open', 'closed', 'pending'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status. Valid statuses are open, closed, or pending.' });
      }

      // Fetch tickets based on status
      const tickets = await Ticket.findAll({
          where: { status }
          //include: [{ model: Customer }, { model: Employee }] // Include related models if needed
      });
  
      if (tickets.length === 0) {
          return res.status(404).json({ message: 'No tickets found for the specified status.' });
      }

      return res.status(200).json(tickets);
  } catch (error) {
      console.error('Error fetching tickets by status:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};

//two more functions 

// Function to allow customers to reopen their closed tickets
exports.reopenTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    
   // const { customer_id } = req.user; 

    const ticket = await Ticket.findOne({ where: { ticket_id} });
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status !== 'closed') {
      return res.status(400).json({ error: 'Only closed tickets can be reopened' });
    }

    ticket.status = 'open';
    await ticket.save();

    res.status(200).json({ message: 'Ticket reopened successfully', ticket });
  } catch (error) {
    console.error('Error reopening ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to allow customers to provide a rating for their closed tickets
exports.rateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    //const { customer_id } = req.user; // Assuming customer_id is available in req.user after authentication
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const ticket = await Ticket.findOne({ where: { ticket_id} });
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status !== 'closed') {
      return res.status(400).json({ error: 'Only closed tickets can be rated' });
    }

    ticket.rating = rating;
    await ticket.save();

    res.status(200).json({ message: 'Rating submitted successfully', ticket });
  } catch (error) {
    console.error('Error rating ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTicketById = async (req, res) => {
  const { ticket_id } = req.params;

  try {
    const ticket = await Ticket.findOne({ where: { ticket_id } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//adding another functionality

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const customerId = req.user.id;

  try {
      // Fetch the customer by ID
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
          return res.status(404).json({ error: 'Customer not found' });
      }

      // Verify the old password
      const isMatch = await bcrypt.compare(oldPassword, customer.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Old password is incorrect' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the customer's password
      customer.password = hashedNewPassword;
      await customer.save();

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

//functionality to allow customers to update their own tickets

exports.updateCustomerTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params; // Get the ticket_id from the request params
    const { category, type, description } = req.body; // Get the updated fields from the request body
    const customerId = req.user.id; 

    // Find the ticket belonging to the customer
    const ticket = await Ticket.findOne({ where: { ticket_id} });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or does not belong to this customer' });
    }

    // Update the ticket details
    ticket.category = category || ticket.category;
    ticket.type = type || ticket.type;
    ticket.description = description || ticket.description;

    await ticket.save();

    res.status(200).json({ message: 'Ticket updated successfully', ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



