const express = require('express');
const router = express.Router();
const {body , validationResult}  = require('express-validator');
const User = require('../models/Users');
const  bcrypt = require('bcryptjs');
const gravatar =require('gravatar');
const jwt = require('jsonwebtoken');
const authenticate  = require('../middlewares/authenticate');


/*
    @usage : to Register a User
    @url : /api/users/register
    @fields : name , email , password
    @method : POST
    @access : PUBLIC
 */
router.post('/register' ,[
    body('name').notEmpty().withMessage('Name required'),
    body('email').notEmpty().withMessage('Email required'),
    body('password').notEmpty().withMessage('Password required'),
], async (request , response)=>{
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors : errors.array()});
    }
   try {
        //data from client form
        let {name, email , password} = request.body;
        //check user is already exist or not
       let user = await User.findOne({email : email});
       if (user){
           return response.status(401).json({errors : [{msg : 'User already exist.'}]});
       }
       //encode password
       let salt= await bcrypt.genSalt(10);
       password = await bcrypt.hash(password , salt);

       // avatar url
       let avatar = gravatar.url(email , {
           s : '300',
           r : 'pg',
           d : 'mm'
       });

       //insert user data to database
       user = new User({name , email , password , avatar});
       await user.save();
       response.status(200).json({msg:'Registration successful'})
   }
   catch (error) {
console.error(error);
response.status(500).json({errors : [{msg : error.message}]})
   }
});


/*
    @usage : to Login a User
    @url : /api/users/login
    @fields : email , password
    @method : POST
    @access : PUBLIC
 */

router.post('/login' ,[
    body('email').notEmpty().withMessage('Email required'),
    body('password').notEmpty().withMessage('Password required')
],async (request , response)=>{
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({errors : errors.array()});
    }
    try {
        let {email , password}  = request.body;
        //check if email correct or not
        let user = await User.findOne({email : email});
        if (!user){
            return response.status(401).json({errors : [{msg : 'Invalid Email '}]});
        }
        //check the password
        let isMatch = await bcrypt.compare(password , user.password);
        if (!isMatch){
            return response.status(401).json({errors : [{msg : 'Invalid Password '}]});
        }
        //create a token and send to client
        let payload = {
            user : {
                id : user.id,
                name : user.name
            }
        };
        //
        jwt.sign(payload , process.env.JWT_SECRET_KEY , (error ,token)=>{
            if (error) throw  error;
                response.status(200).json({
                    msg : 'Login Success',
                    token : token
                });
        })

    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : error.message}]})
    }
});


//get single user info
router.get('/me' , authenticate, async(request , response)=>{
    try {
        let user = await User.findById(request.user.id).select('-password');
        response.status(200).json({
            user : user
        });

    }
    catch (error) {
        console.log(error);
        response.status(500).json({errors : [{msg : error.message}]})
    }
});




module.exports = router;

