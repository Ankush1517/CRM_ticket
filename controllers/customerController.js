const { Customer } = require('../models');

exports.getCustomerDetails = async (req, res) => {
  try {

      const user= await Customer.findByPk(req.user.id);
      
      const customer = await Customer.findAll({ where: { customer_id: user.customer_id }, 
          attributes: ['name', 'email', 'username'] 
      });

      if (!customer) {
          return res.status(404).json({ error: 'Customer not found' });
      }

      res.status(200).json(customer);
  } catch (error) {
      console.error('Error fetching customer details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.createCustomer = async (req, res) => {
  const { name, email, phone, address, account_status } = req.body;
  const customer_id = generateCustomerId();
  const account_creation_date = new Date();
  const username = `${name}${phone.slice(-4)}`;

  const customer = new Customer({
    name, email, phone, address, customer_id, account_creation_date, account_status, username
  });

  await customer.save();
  res.status(201).send('Customer created');
};

function generateCustomerId() {
    const randomNum = Math.floor(Math.random() * 10000);
    const timestamp = Date.now();
    return `CUST-${randomNum}-${timestamp}`;
}


