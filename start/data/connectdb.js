const mongoose = require('mongoose')
mongoose.set("strictQuery", true);
const connectdb = (url)=>{
    return mongoose.connect(url)
  };
  module.exports = connectdb;
