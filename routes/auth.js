const express = require('express')
const User = require('../models/User');
const Router = express.Router();


//Creating User using POST: "/api/auth/"

Router.post('/' , (req,res)=>{
    console.log(req.body)
    const user = User(req.body)
    user.save()
    res.send(req.body)
})

module.exports = Router