// Importing required packages
const express = require('express')          // Express framework for creating server & APIs
const mongoose = require ('mongoose')       // Mongoose for MongoDB database connection
const cors=require('cors')                  // CORS to allow cross-origin requests
const bodyParser = require('body-parser');  // Middleware to handle JSON data
const dotenv = require('dotenv')
const app =new express()
const jwt = require("jsonwebtoken")         // JWT for authentication
const bcrypt = require("bcryptjs")          // bcrypt compare support for hashed legacy users
const { GoogleGenerativeAI } = require("@google/generative-ai")

dotenv.config()

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

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
  image:String,
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
    phone: req.body.phoneNum,
    image: req.body.image || ""
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
    res.json({
      message : 'success',
      token,
      user: {
        email: newUser.email,
        name: newUser.name,
        userName: newUser.username,
        phoneNum: newUser.phone,
        image: newUser.image || "",
      },
    })
  }).catch((err)=>{res.json(err)})
})


// API for login and check credentials
app.post('/login',async(req,res)=>{
  console.log("hi",req.body)
  try {
    const email = String(req.body.email || "").trim()
    const password = String(req.body.password || "")

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const escapedEmail = escapeRegex(email)

    // Find one user with email
    const userData = await User.findOne({
      email : { $regex: new RegExp(`^${escapedEmail}$`, "i") },
    })

    // If no user found
    if(!userData)
      return res.status(401).json({error : "user not found"})

    // Match password for both plain-text and bcrypt-hashed records.
    let isPasswordMatch = userData.password === password
    if (!isPasswordMatch && typeof userData.password === "string" && userData.password.startsWith("$2")) {
      isPasswordMatch = await bcrypt.compare(password, userData.password)
    }

    if(isPasswordMatch){
      // Generate JWT token on successful login
      const token = jwt.sign(
        { email : userData.email , username : userData.username },
        JWT_SECRET,
        { expiresIn : '2h'}
      )
      console.log('signed')
      return res.json({
        success: true,
        token : token,
        user: {
          email: userData.email,
          name: userData.name,
          userName: userData.username,
          phoneNum: userData.phone,
          image: userData.image || "",
        },
      })
    }

    // Invalid password
    return res.status(401).json({ error: "Invalid Credentials" })
  } catch (error) {
    console.error("Login error", error)
    return res.status(500).json({ error: "Login failed" })
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

app.put('/updateProfile', async (req, res) => {
  try {
    const { email, name, image } = req.body || {}

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const updateData = {}
    if (typeof name === 'string') {
      updateData.name = name.trim()
    }
    if (typeof image === 'string') {
      updateData.image = image
    }

    await User.updateOne(
      { email },
      { $set: updateData }
    )

    const updatedUser = await User.findOne({ email })

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        email: updatedUser?.email || email,
        name: updatedUser?.name || '',
        userName: updatedUser?.username || '',
        phoneNum: updatedUser?.phone || '',
        image: updatedUser?.image || '',
      },
    })
  } catch (error) {
    console.error('Update profile error', error)
    return res.status(500).json({ error: 'Failed to update profile' })
  }
})

app.post('/summarize', async (req, res) => {
  try {
    const { text, limit } = req.body || {}

    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' })
    }

    let maxWords = 50
    if (limit !== undefined) {
      const parsedLimit = Number(limit)

      if (!Number.isInteger(parsedLimit) || parsedLimit < 10 || parsedLimit > 150) {
        return res.status(400).json({
          error: 'limit must be an integer between 10 and 150',
        })
      }

      maxWords = parsedLimit
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key is not configured')
      return res.status(500).json({ error: 'Gemini API key is not configured' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = [
      `Summarize the following blog in 2-3 sentences or maximum ${maxWords} words.`,
      'Keep it clear, concise, and easy to read.',
      'Do not repeat ideas and include only meaningful key points.',
      '',
      text,
    ].join('\n')

    const result = await model.generateContent(prompt)
    const summary = result.response.text().trim()
    console.log('Summary generated:', summary)
    return res.json({ summary })
  } catch (error) {
    console.error('Summarize error', error)
    return res.status(500).json({ error: 'Failed to generate summary' })
  }
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
