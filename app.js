const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));


const userRouter=require('./routes/user');
const ticketRouter=require('./routes/ticket');

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/user', userRouter);
app.use('/ticket', ticketRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
