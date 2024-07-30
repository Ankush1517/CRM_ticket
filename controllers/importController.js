const ExcelJS = require('exceljs');
const { Customer } = require('../models');

exports.importCustomers = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);
  const sheet = workbook.getWorksheet(1);

  const customers = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header
      const [name, emailCell, phoneCell, account_creation_date, account_status] = row.values.slice(1);
      //const username = `${name}${phone.slice(-4)}`;
      
      const email = emailCell.text || emailCell;
      const phone = phoneCell.text || phoneCell;

      const phoneStr = String(phone);
      
      // Generate username with a fallback if phone is not valid
      const username = `${name.replace(/\s+/g, '')}${phoneStr.slice(-4) || '0000'}`;
      
      //const username = `${name.replace(/\s+/g, '')}${phone.slice(-4)}`;
      customers.push({ name, email, phone: phoneStr, account_creation_date, account_status, username });
    }
  });

  await Customer.bulkCreate(customers);
  res.status(201).send('Customers imported');
};
