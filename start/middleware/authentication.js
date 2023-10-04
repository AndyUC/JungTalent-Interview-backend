const User =require('../model/userSchema')
const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('./unauthenticated');


const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader|| !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('No token here')
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {userID:payload.userID,name:payload.name};
        next();
    } catch (error) {
            throw new UnauthenticatedError('not authorized to access this route')       
    }
} ;

module.exports= authMiddleware;