const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Employee, Customer } = require('../models');
const config = require('../config/config') ;

exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (role === 'employee') {
      const user = new Employee({ username, password: hashedPassword });
      await user.save();
      res.status(201).send('Employee registered');
    } else if (role === 'customer') {
      const { name, email, phone, address, account_status } = req.body;
      const customer_id = generateCustomerId();
      const account_creation_date = new Date();
      //const username = `${name}${phone.slice(-4)}`;
      const username = `${name.replace(/\s+/g, '')}${phone.slice(-4)}`;

      const customer = new Customer({
        name, email, phone, address, customer_id, account_creation_date, account_status, username, password: hashedPassword
      }); 
  
      await customer.save();
      res.status(201).json(customer);
    } else {
      res.status(400).send('Invalid role specified');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
};




exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await Employee.findOne({ where: { username } });
    if (!user) {
      user = await Customer.findOne({ where: { username } });
    }
  
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret);
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
};


function generateCustomerId() {

    const minId=0;
    const maxId = 214747;
    const randomNum = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
//   const timestamp = Date.now();
  return parseInt(`${randomNum}`);
}


