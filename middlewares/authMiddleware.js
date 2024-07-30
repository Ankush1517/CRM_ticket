const jwt = require('jsonwebtoken');
const config = require('../config/config') ;

exports.authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// const jwt = require('jsonwebtoken');
// const { Customer, Employee } = require('../models');
// const config = require('../config/config');

// exports.authenticateJWT = async (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied' });

//   try {
//     const decoded = jwt.verify(token, config.jwt.secret);
//     req.user = decoded;

//     console.log('Token decoded:', decoded);

//     // Optionally, fetch the user from the database
//     const customer = await Customer.findByPk(decoded.id);
//     const employee = await Employee.findByPk(decoded.id);
//     if (customer) {
//       req.user = { ...decoded, role: 'customer' };
//     } else if (employee) {
//       req.user = { ...decoded, role: 'employee' };
//     } else {
//       return res.status(401).json({ error: 'Invalid token' });
//     }
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

