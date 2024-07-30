const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    customer_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    account_creation_date: DataTypes.DATE,
    account_status: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'customer'
    }
  });
};
