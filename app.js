const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const reportRoutes = require('./routes/reportRoutes');
const importRoutes = require('./routes/importRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/ticket', ticketRoutes);
app.use('/report', reportRoutes);
app.use('/import', importRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
