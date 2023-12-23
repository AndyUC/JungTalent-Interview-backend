require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io')
const {createServer} = require('http')

const app = express();
const connectdb = require('./data/connectdb');
const orderRouter = require('./router/orderRouter');
const productRouter = require('./router/productRouter');
const authrouter = require('./router/authRouter')
const webpush = require('web-push')

app.use(cors())
app.use(express.json())
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/auth', authrouter)

const publicVapidKey= 'BK-LPd2hDKcEzDOsFncWG4_1KOyZOWx8EAbSK8arLHBCF5Df-m12Rt8mz-JNV7KHmILsuRbn0RbvNisgoYvIElM';
const privateVapidKey= 'XMyk7tly59MU6h1nlsNxIZSUCP7vqpdAW0zdr5Hh60s';

const webpushHeader = webpush.setVapidDetails('mailto:nhanduc811@gmail.com',publicVapidKey,privateVapidKey)

const endpoints = []

const httpSever = createServer(app);
const io = new Server(httpSever, {
  cors: {
    origin: process.env.CLIENT_URL||`${process.env.CLIENT_URL}*`||`${process.env.CLIENT_URL}:*`,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
io.on('connection', (socket) => {
  console.log(`user connection: ${socket.id}`)
  io.emit(socket.id);
  // server receive room from client and send 
  // after that server create room
  socket.on(
    'room',
    room => {
      socket.join(room);
      console.log(room);
    }
  )
  // receive message attached room chat and send back to client
  socket.on('send_message', (message) => {
    const messageObject= JSON.parse(message.message)
    const {chatmessage,subscription}= messageObject
    console.log(chatmessage,subscription.subscription)
    const data = {user:socket.id,message:chatmessage}
    const parsedUrl = new URL(subscription.subscription.endpoint)
    const audience = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    const vapidHeaders = webpush.getVapidHeaders(
      audience,
      'mailto: example@web-push-node.org',
      publicVapidKey,
      privateVapidKey,
      'aes128gcm'
    );
    webpush.sendNotification(
     subscription.subscription,
     JSON.stringify({title:"A new message here"}),
     {
      headers: vapidHeaders
     }
      )
    socket.emit("chat-message",data)
    socket.broadcast.emit("chat-message",data)
  })
  
  //receive and send is typing
  socket.on('typing',()=>{
    socket.broadcast.emit('typing')
  })
})


console.log(process.env.MONGO_URI)
const start = async () => {
  try {
    console.log(process.env.PORT)
    await connectdb(process.env.MONGO_URI);
    httpSever.listen(process.env.PORT || 3000)
  } catch (error) {
    console.log(error)
  }
}
start()