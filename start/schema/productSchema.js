const mongoose = require('mongoose');

function percent (val){
    return val>=0&&val<=100
}
const ProductCreateOrderSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please provide your Product Name'],
    },
    imageUrl:{
        type: String,
        required:[true,'Please provide Image'],
    },
    brand:{
        type:String,
        required:[true,'Please provide your Brand'],
    },
    discount:{
        type:Number,
        validate:[percent,'discount incorrect']
    },
    price:{
        type: Number,
        required:[true,'Please provide price'],
        validate:{
            validator:Number.isFinite,
            message:'{VALUE} is not an number'
        }
    },
    catalog:{
      type: String,
      enum:['Chain', 'Glass','Tie','Watch'],
      required:true,
       message: '{VALUE} is not support'
      },
        subcatalog:['String']
      ,
      remain:{
        type: Number,
        required:[true,'please insert Storage'],
        } 
      
    }
)



module.exports =mongoose.model("ProductCreateOrderSchema",ProductCreateOrderSchema)