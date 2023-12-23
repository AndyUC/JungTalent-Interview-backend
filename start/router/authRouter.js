const express = require('express')
const authrouter = express.Router();
const {login,oauth,callback}= require('../controller/auth')
authrouter.post('/login',login)
authrouter.get('/oauth2/google',oauth )
authrouter.get('/oauth2/callback',callback )
module.exports = authrouter