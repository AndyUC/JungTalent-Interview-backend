const express = require('express')
const orderRouter = express.Router();
const {createorder}= require('../controller/order')
orderRouter.route('/').post(createorder)
module.exports = orderRouter;