const { Customer } = require('../models');

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


