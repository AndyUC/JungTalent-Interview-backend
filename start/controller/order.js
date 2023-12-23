
const BadrequestError = require("../middleware/badrequest");
const NotfoundError= require('../middleware/notfound');
const { StatusCodes } = require("http-status-codes");
  const sdk = require('api')('@scalapaydocs/v1.1#5ryqsdllosocp4');


const createorder = async (req,res)=>{
  const {consumer,billing,shipping,items,shippingAmount,taxAmount,discounts,totalAmount}=req.body
  const objectQuery={}
  let error =[]
    if(Object.entries(consumer).length !== 0 ){
    objectQuery.consumer=consumer;
  }
  if(Object.entries(billing).length !== 0){
    objectQuery.billing=billing;
  }
  if(Object.entries(shipping).length !== 0){
    objectQuery.shipping=shipping;
  }
  if(items.length>0){
    objectQuery.items=items;
  }
  if(Object.entries(shippingAmount).length !== 0){
    objectQuery.shippingAmount=shippingAmount;
  }
  if(Object.entries(taxAmount).length !== 0){
    objectQuery.taxAmount=taxAmount;
  }
  if(discounts.length>0){
    objectQuery.discounts=discounts;
  }
  if(Object.entries(totalAmount).length !== 0){
    objectQuery.totalAmount=totalAmount;
  }
    sdk.auth('Bearer qhtfs87hjnc12kkos'); sdk.postV2Orders({
  ...objectQuery,
  merchant: {
    redirectCancelUrl: 'https://portal.integration.scalapay.com/failure-url',
    redirectConfirmUrl: 'https://portal.integration.scalapay.com/success-url'
  },
  type: 'online',
  product: 'pay-in-3',
  orderExpiryMilliseconds: 600000
}).then(({ data }) => {const obj=data; res.send(obj)})
.catch(err => {console.log(err);res.status(err.status).send(err.data.message.errors) });

}
module.exports = {createorder}
