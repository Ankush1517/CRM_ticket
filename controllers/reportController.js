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



