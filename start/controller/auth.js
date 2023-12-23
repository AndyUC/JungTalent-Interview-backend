const User = require('../schema/userSchema');
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis')
const qs = require('qs')
require('dotenv').config();

const BadrequestError = require('../middleware/badrequest');
const UnauthenticatedError = require('../middleware/unauthenticated');
const { default: axios } = require('axios');


const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadrequestError('please insert username and password')
    }
    const user = await User.findOne({ username });
    if (!user) {
        throw new UnauthenticatedError(`Invalid credentials`)
    }

    const ispasswordMatch = await user.comparePassword(password)
    if (!ispasswordMatch) {
        throw new UnauthenticatedError(`Invalid credentials`)
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: username }, token });
}
const oauth = (req,res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENTID,
        process.env.CLIENTSECRET,
        'http://localhost:3000/api/v1/auth/oauth2/callback'
    );
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
    })
    res.send(authorizationUrl)
}
const callback=async(req,res)=>{
    const {code} = req.query
    const values ={
        code:code,
        client_id:process.env.CLIENTID,
        client_secret:process.env.CLIENTSECRET,
        grant_type:"authorization_code",
        redirect_uri:'http://localhost:3000/api/v1/auth/oauth2/callback'
    }
  
        const googleToken = await axios.post('https://oauth2.googleapis.com/token',values,{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
        }
    })
    const data = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleToken.data.access_token}`,{headers:{Authorization:`Bearer ${googleToken.data.id_token}`}})
    const user = await User.findOne({ email:data.data.email });
    if(user){
        const token = user.createJWT();
        
        res.writeHead(302, {
            Location: 'http://localhost:3001/login',
            'Set-Cookie':'token='+token
        });
        res.end();
    }else{
        res.status(StatusCodes.BAD_REQUEST).send('email invalid')
    }
}
module.exports = {login,oauth,callback}