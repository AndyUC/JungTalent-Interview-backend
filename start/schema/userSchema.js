const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({ 
    email:{
        type: String,
        required: [true,'please insert email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide valid email'],
        unique: [true,'email have been created']
    },
    username:{
        type: String,
        required: [true,'please insert username'],
        unique: [true,'email have been created']
    },
    password:{
        type: String,
        required: [true,'please insert password']

    }
    
})

UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})
UserSchema.methods.createJWT = function(){
    return jwt.sign({userID:this._id,name:this.username},process.env.JWT_SECRET,{expiresIn:'30d'})
}
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = bcrypt.compare(candidatePassword, this.password)
    return isMatch
}
module.exports = mongoose.model('User',UserSchema);