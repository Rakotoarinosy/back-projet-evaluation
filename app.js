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


//Socket
let users=[];
io.on('connection', socket => {
  console.log('User connected', socket.id);
  socket.on('addUser', userId => {
      const isUserExist = users.find(user => user.userId === userId);
      if (!isUserExist) {
          const user = { userId, socketId: socket.id };
          users.push(user);
          io.emit('getUsers', users);
      }
  });

  socket.on('sendMessage', async ({ newMessage }) => {
      const receiver = users.find(user => user.userId === newMessage.receiverId);
      const sender = users.find(user => user.userId === newMessage.senderId);
      // const user = await Users.findById(senderId);
      console.log('sender :>> ', sender, receiver);
      if (receiver) {
          io.to(receiver.socketId).to(sender.socketId).emit('getMessage', 
              newMessage
          );
          }else {
              io.to(sender.socketId).emit('getMessage', 
                  newMessage
              );
          }
      });

  socket.on('disconnect', () => {
      users = users.filter(user => user.socketId !== socket.id);
      io.emit('getUsers', users);
  });
  // io.emit('getUsers', socket.userId);
});



app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/user',/*checkTokenMiddleware,*/ userRouter);
app.use('/ticket', ticketRouter);
app.use('/auth', authRouter);
app.use('/statu', statuRouter);
app.use('/conversation',conversationRouter);
app.use('/message',messageRouter);



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
