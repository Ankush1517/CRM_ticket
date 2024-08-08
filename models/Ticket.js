const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ticket_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    customer_id: DataTypes.INTEGER,
    employee_id: DataTypes.INTEGER,
    /*status: DataTypes.STRING,*/
    status: {
      type: Sequelize.ENUM('open', 'closed', 'pending'),
      defaultValue: 'open' // Default status when a ticket is created
    },
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: DataTypes.STRING,
    category: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    raisedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  

  });
};
