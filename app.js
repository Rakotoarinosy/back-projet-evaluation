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


//Socket
let users = [];

io.on('connection', socket => {
  console.log('User connected', socket.id);
  
  socket.on('addUser', ({ data }) => {
    console.log('addUser');
    const userIndex = users.findIndex(user => user.userId === data.userId);
    
    if (userIndex === -1) {
      const newUser = { userId: data.userId, userRole: data.userRole, socketId: socket.id };
      users.push(newUser);
    } else {
      users[userIndex].socketId = socket.id; // Mettre à jour l'ID du socket existant pour l'utilisateur
    }

    io.emit('getUsers', users);
    console.log(users);
  });


  socket.on('sendMessage', async ({ newMessage }) => {
      const receiver = users.find(user => user.userId === newMessage.receiverId);
      const sender = users.find(user => user.userId === newMessage.senderId);
      // const user = await Users.findById(senderId);
    if(receiver){

    }

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

  socket.on('sendNotification', notification =>{  

    for (let i = 0; i < users.length; i++) {
      let user = users[i];

      if (user.userId === notification.receiverId){
        io.to(user.socketId).emit('getNotification', 
        notification
    );
      }
    }

  })




  socket.on('disconnecte', userId => {

      users = users.filter(user => user.userId !== userId);
      console.log(users)
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
app.use('/notification',notificationRouter);
app.use('/dashboard',dashboardRouter);




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
