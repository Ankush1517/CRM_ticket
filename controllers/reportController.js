// const ExcelJS = require('exceljs');
// const { Customer, Ticket, Employee } = require('../models');


const { Ticket, Customer, Employee } = require('../models');
const ExcelJS = require('exceljs');

exports.generateReport = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            include: [
                { model: Customer, attributes: ['name', 'email'] },
                { model: Employee, attributes: ['username'] }
            ]
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Tickets Report');

        sheet.columns = [
            { header: 'Ticket ID', key: 'id', width: 10 },
            { header: 'Customer Name', key: 'customer_name', width: 30 },
            { header: 'Customer Email', key: 'customer_email', width: 30 },
            { header: 'Employee', key: 'employee_username', width: 30 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Created At', key: 'created_at', width: 20 }
        ];

        tickets.forEach(ticket => {
            sheet.addRow({
                id: ticket.id,
                customer_name: ticket.Customer.name,
                customer_email: ticket.Customer.email,
                employee_username: ticket.Employee.username,
                description: ticket.description,
                status: ticket.status,
                created_at: ticket.createdAt.toISOString()
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=tickets_report.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating report:', error.message, error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


/*
exports.generateReport = async (req, res) => {*/
  // const workbook = new ExcelJS.Workbook();
  // const sheet = workbook.addWorksheet('Report');

  // const customers = await Customer.findAll();
  // const tickets = await Ticket.findAll();

  // sheet.columns = [
  //   { header: 'Customer Name', key: 'name', width: 20 },
  //   { header: 'Email', key: 'email', width: 30 },
  //   { header: 'Phone', key: 'phone', width: 20 },
  //   { header: 'Ticket Description', key: 'description', width: 40 },
  //   { header: 'Ticket Status', key: 'status', width: 15 },
  // ];

  // customers.forEach(customer => {
  //   const customerTickets = tickets.filter(ticket => ticket.customer_id === customer.id);
  //   customerTickets.forEach(ticket => {
  //     sheet.addRow({
  //       name: customer.name,
  //       email: customer.email,
  //       phone: customer.phone,
  //       description: ticket.description,
  //       status: ticket.status
  //     });
  //   });
  // });

  // const buffer = await workbook.xlsx.writeBuffer();
  // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  // res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
  // res.send(buffer);

//   try {
//     const tickets = await Ticket.findAll({
//         include: [
//             { model: Customer, attributes: ['name', 'email'] },
//             { model: Employee, attributes: ['username'] }
//         ]
//     });

//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('Tickets Report');

//     sheet.columns = [
//         { header: 'Ticket ID', key: 'id', width: 10 },
//         { header: 'Customer Name', key: 'customer_name', width: 30 },
//         { header: 'Customer Email', key: 'customer_email', width: 30 },
//         { header: 'Employee', key: 'employee_username', width: 30 },
//         { header: 'Description', key: 'description', width: 30 },
//         { header: 'Status', key: 'status', width: 10 },
//         { header: 'Created At', key: 'created_at', width: 20 }
//     ];

//     tickets.forEach(ticket => {
//         sheet.addRow({
//             id: ticket.id,
//             customer_name: ticket.Customer.name,
//             customer_email: ticket.Customer.email,
//             employee_username: ticket.Employee.username,
//             description: ticket.description,
//             status: ticket.status,
//             created_at: ticket.created_at
//         });
//     });

//     const buffer = await workbook.xlsx.writeBuffer();
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename="tickets_report.xlsx"');
//     res.send(buffer);
//   } catch (error) {
//     console.error('Error generating report:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };
