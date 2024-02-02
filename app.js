const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors')
const io = require('socket.io')(8080, {
  cors: {
      origin: 'http://localhost:3000',
  }
});

const checkTokenMiddleware = require('./jsonwebtoken/check')


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors())



const userRouter=require('./routes/user');
const ticketRouter=require('./routes/ticket');
const authRouter=require('./routes/auth');
const statuRouter=require('./routes/statu');
const conversationRouter=require('./routes/conversation');
const messageRouter = require('./routes/message')
const notificationRouter = require('./routes/notification')
const dashboardRouter = require('./routes/dashboard')
const observationRouter = require('./routes/observation')
const lyceeRouter = require('./routes/lycee')
const classeRouter = require('./routes/classe')




app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/user',/*checkTokenMiddleware,*/ userRouter);
app.use('/ticket', ticketRouter);
app.use('/auth', authRouter);
app.use('/statu', statuRouter);
app.use('/conversation',conversationRouter);
app.use('/message',messageRouter);
app.use('/notification',notificationRouter);
app.use('/dashboard',dashboardRouter);
app.use('/observation',observationRouter);
app.use('/lycee',lyceeRouter);
app.use('/classe',classeRouter);





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
