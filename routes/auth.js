const express = require('express')
const User = require('../models/User');
const Router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')


// ROUTE 1 : Creating User using POST: "/api/auth/createuser" No Login Required

Router.post('/createuser' ,[
    body('name','Name must be of at least 3 characters').isLength({ min: 3 }),
    body('email','Enter a valid mail ID').isEmail(),
    body('password','password must be of at least 5 characters').isLength({ min: 5 })

], async (req,res)=>{
    //Method to sending data to database
    // console.log(req.body)
    // const user = User(req.body)
    // user.save()
    //res.send(req.body)
    
    //If there are errors return bad request and error message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {

      //Generating salt for password
      const salt = await bcrypt.genSalt(10);

      //Hashing the Password
      const securedPassword = await bcrypt.hash(req.body.password,salt)

      
    //Method to sending data to database
        //Check whether the user with this email exists
    let userWithSameEmail = await User.findOne({email:req.body.email})
    if(userWithSameEmail){
        return res.status(400).json({error : 'Sorry the user with this email already Exists'})
    }
    //Method to sending data to database
    let user = await User.create({
        name: req.body.name,
        email : req.body.email,
        password: securedPassword
      })
      // .then(user => res.json(user)).
      
      // catch(err => {
      //   console.log(err)
      //   res.json({error : 'Enter a unique value for email', message : err.message})
      // });
      
      //
      //res.send(user)

      const data ={
        user : {
          id : user.id
        }
      }

      const JWT_SECRET = 'Harryis@goodboy$'
      
      //Generating token for the users
      const authToken =  jwt.sign(data,JWT_SECRET)
      //Sending token as response to user
      res.json({authToken})

    
    } catch (error) {
      console.log(error.message)
      res.status(500).send("Internal Server Error")
    }
    
})

//ROUTE 2 : Authenticate the USer POST: "/api/auth/login" No Login Required

Router.post('/login',[
  body('email','Enter a valid mail ID').isEmail(),
  body('password','password should not be blank').exists()
],async (req,res)=>{
  
  //If there are errors return bad request and error message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
// Destructuring the variables from req.body
  const {email , password} = req.body
  //OR 
  // const email = req.body.email
  // const password = req.body.password
  try {
    let user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error : 'Please enter the valid Credentials'})
    }
    
    //Comparing the password entered by user and password stored in database
    const passwordCompare = await bcrypt.compare(password,user.password)
    if(!passwordCompare){
      return res.status(400).json({error : 'Please enter the valid Credentials'})
    }
    
    const data ={
      user : {
        id : user.id
      }
    }

    const JWT_SECRET = 'Harryis@goodboy$'
    
    //Generating token for the users
    const authToken =  jwt.sign(data,JWT_SECRET)
    //Sending token as response to user
    res.json({authToken})


  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error")
  }
})


//ROUTE 3 : Getting logged in user details using POST: "/api/auth/getuser" Login Required

Router.post('/getuser' ,fetchuser , async (req,res)=>{
   
   try {
    let userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
   } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error")
  }


})
module.exports = Router