const { Ticket, Employee, Customer } = require('../models');

exports.raiseTicket = async (req, res) => {
  const { customer_id, description } = req.body;

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
    customer_id: parsedCustomerId, employee_id, status: 'Open', description, created_at: new Date()
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

      console.log('Customer: ', req.user);
      const user= await Customer.findByPk(req.user.id);
      console.log("user found",user);
      tickets = await Ticket.findAll({ where: { customer_id: user.customer_id } });

    } else if (req.user.role === 'employee') {
      tickets = await Ticket.findAll();
    } else {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTicketStatus = async (req, res) => {
  const { ticket_id, status, response, type, category } = req.body;
  const employeeId = req.user.id;

  try {
    const ticket = await Ticket.findOne({ where: { id: ticket_id, employee_id: employeeId } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or not assigned to this employee' });
    }

    
    ticket.status = status;
    ticket.response = response;
    ticket.type = type ;
    ticket.category = category ;
    await ticket.save();

    res.status(200).json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};