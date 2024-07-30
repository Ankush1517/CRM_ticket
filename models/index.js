const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect});

const Customer = require('./Customer')(sequelize);
const Employee = require('./Employee')(sequelize);
const Ticket = require('./Ticket')(sequelize);


// Update the associations
Customer.hasMany(Ticket, { foreignKey: 'customer_id', sourceKey: 'customer_id' });
Ticket.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'customer_id' });

Employee.hasMany(Ticket, { foreignKey: 'employee_id' });
Ticket.belongsTo(Employee, { foreignKey: 'employee_id' });



/*
Customer.hasMany(Ticket, { foreignKey: 'customer_id' });
Ticket.belongsTo(Customer, { foreignKey: 'customer_id' });

Employee.hasMany(Ticket, { foreignKey: 'employee_id' });
Ticket.belongsTo(Employee, { foreignKey: 'employee_id' });*/

module.exports = {
  sequelize,
  Customer,
  Employee,
  Ticket
};
