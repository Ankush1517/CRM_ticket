const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id: DataTypes.INTEGER,
    employee_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: DataTypes.STRING,
    category: DataTypes.STRING,
  

  });
};
