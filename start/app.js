require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose')

const app = express();
const connectdb = require('./data/connectdb');
const orderRouter = require('./router/orderRouter');
const productRouter = require('./router/productRouter');

app.use(cors())
app.use(express.json())
app.use('/api/v1/order',orderRouter);
app.use('/api/v1/product',productRouter);

console.log(process.env.MONGO_URI)
const start = async()=>{
  try {
    console.log(process.env.PORT)
    await connectdb(process.env.MONGO_URI) ;
       app.listen(process.env.PORT||3000) 
  } catch (error) {
    console.log(error)
  }
}
start()