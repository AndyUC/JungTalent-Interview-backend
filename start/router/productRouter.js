const express = require('express')
const productRouter = express.Router();
const {getallproduct,getproduct}= require('../controller/product')
productRouter.route('/').get(getallproduct)
productRouter.route('/:id').get(getproduct)

module.exports = productRouter;