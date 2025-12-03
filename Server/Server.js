// Importing required packages
const express = require('express')          // Express framework for creating server & APIs
const mongoose = require ('mongoose')       // Mongoose for MongoDB database connection
const cors=require('cors')                  // CORS to allow cross-origin requests
const bodyParser = require('body-parser');  // Middleware to handle JSON data
const app =new express()
const jwt = require("jsonwebtoken")         // JWT for authentication

// Enable CORS so frontend can access backend API
app.use(cors({origin:'*'}))

app.use(bodyParser.json({
  limit : "50mb"
}))

// Connect to MongoDB
mongoose.connect('mongodb+srv://kartiksharma:kartik%401@cluster0.nlrknbv.mongodb.net/server').then(()=>{
  console.log("connection successfull")  
})

// user schema
const user=mongoose.Schema({
  email:String,
  password:String,
  username:String,
  name:String,
  phone:String,
  blogs: Array,   // stores blogs created by user
})

// Secret key for signing JWT tokens 
const JWT_SECRET = "yourSuperSecretKey123"; 

// Create mongoose model for users 
const User=mongoose.model("signup",user)

// API to create and save blog for a particular user
app.post('/createBlog', async(req , res)=>
{
  console.log("reached",req.body.blogData)
 try {
  // Find user by email and push new blog inside their blogs array
  const result = await User.updateOne(
    {email :req.body.email },
    { $push: { blogs :  req.body.blogData } }
  )
  res.json('success')
  console.log("result",result)
 } catch (error) {
  console.log('error',error)
 }
})


// API for signup new user
app.post('/signup',async(req , res)=>{
  console.log("reached",req.body)

  // Create a new user object
  const newUser = new User({
    email : req.body.email,
    password : req.body.password,
    username : req.body.userName,
    name : req.body.name,
    phone: req.body.phoneNum
  })

  // Save user in MongoDB
  newUser.save().then(()=>{
    // Generate JWT token for authentication
    const token = jwt.sign(
      {email : newUser.email , username : newUser.username },
      JWT_SECRET,
      {expiresIn : "2h"} // Token expires in 2 hours
    )
    console.log('success')
    res.json({ message : 'success', token })
  }).catch((err)=>{res.json(err)})
})


// API for login and check credentials
app.post('/login',async(req,res)=>{
  console.log("hi",req.body)

  // Find user with email
  const userData = await User.find({
    email : req.body.email,
  })

  // If no user found
  if(!userData)
    return res.status(401).json({error : "user not found"})

  console.log(userData)

  // Match password
  if(userData[0].password===req.body.password){
    // Generate JWT token on successful login
    const token = jwt.sign(
      { email : userData.email , username : userData.username },
      JWT_SECRET,
      { expiresIn : '2h'}
    )
    console.log('signed')
    res.json({ success: true , token : token })
  }
  else{
    // Invalid password
    res.status(401).json("Invalid Credentials")
  }
})


// API to fetch all blogs from all users
app.post('/fetchBlog',async(req,res)=>{
  const data = await User.find({})
  console.log(data)
  res.json({ data:data })
})


// API to fetch blogs of a specific user (using email)
app.post('/blog',async(req,res)=>{
  const email = req.body.email
  const result = await User.find({email:email})
  console.log("develop",result)
  res.json({ data:result })
})

// API for delete blog 

app.delete("/deleteBlog/:email/:index", async (req, res) => {
  try {
    const { email, index } = req.params;

    // Remove blog with matching _id from user's blogs array
    await User.updateOne(
      {email},
      { $unset: { [`blogs.${index}`]: 1 } }   // unset blog at that index
    );
     // Step 2: pull null values from array
    await User.updateOne(
      { email },
      { $pull: { blogs: null } }
    );
      res.json({ success: true, message: "Blog deleted successfully" });
    } 
   catch (error) {
    console.error("Error deleting blog", error);
    res.status(500).json({ error: "Internal server error" });
   }
});
app.put("/updateBlog/:email/:index", async (req, res) => {
  try {
    const { email, index } = req.params;
    const { title, content, image } = req.body;

    await User.updateOne(
      { email },
      {
        $set: {
          [`blogs.${index}.title`]: title,
          [`blogs.${index}.blogData.0.text`]: content,
          [`blogs.${index}.blogData.1.image`]: image, // update/keep image
        },
      }
    );

    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Start backend server
app.listen(3000,()=>{console.log('server is running')})
