import React from 'react'
import bgcol from './bgcol.png'
import { useState } from 'react'
import axios from 'axios'
import { toast , ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import star from './star.jpg'
import lamp from './lamp2.jpg'
import vid from "./video.mp4"
import { useDispatch } from 'react-redux'
import { addUser } from './blog'
import { useNavigate } from 'react-router-dom'
import pahad from './plain.jpg'
import Google from './Google'

const Login = () => {
  const [ userName , setUserName] = useState('')
  const [ name , setName] = useState('')
  const [ email , setEmail] = useState('')
  const [  password, setPassword] = useState('')
  const [ confirmPassword, setConfirmPassword] = useState('')
  const [ phoneNum , setPhoneNum] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
 
  const handleRegister = async function(){
    console.log("reached")
    dispatch(addUser({
      userName : userName,
      name : name,
      email : email,
      password : password,
      phoneNum : phoneNum,
    }))
    navigate('/home')
    const result = 
    await axios.post('http://localhost:3000/signup',{
      userName : userName,
      name : name,
      email : email,
      password : password,
      phoneNum : phoneNum,

    })
    console.log(result.data)
    if (result.data==='success')
      {    
      localStorage.setItem("email",email)
      localStorage.setItem("name",name)
      localStorage.setItem("userName",userName)

      
  toast.success('signup successful')
  
}
  }


  return (
    <div id='main'style={{
    
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      height:'100vh',
      width:'100%',
      gap:30
      }}>
        <img style={{
          position:'absolute',
          width:"100vw",
          height:"100vh",
       
        }}  src={pahad}/>
        <ToastContainer/>
        <div style={{position:'absolute',height:"100vh",width:"100%",backgroundColor:"rgba(9,52,76,0.7)",zIndex:2,}}> 
          
        </div>
       
       {/* <div style={{position:'absolute',top:'-30%'}}>
       <video autoPlay={true}  muted={true} src={vid} >
          
          </video>
       </div> */}
        {/* <div style={{height:150,width:150,borderRadius:100,backgroundColor:'green',position:'absolute',left:'40%'}}></div>
        <div style={{height:150,width:150,borderRadius:100,backgroundColor:'rgb(143, 52, 186)',position:'absolute',right:'36%',top:'15%'}}></div>  */}
            <ToastContainer/>
            {/* <img style={{height:800,
      width:'100%',
      position:'absolute'}} src={bgcol}/> */}
{/* <div style={{height:80,width:80,borderRadius:100,backgroundColor:'rgba(31, 203, 15, 0.29)',position:'absolute',left:'35%',top:'70%'}}></div>
<div style={{height:80,width:80,borderRadius:100,backgroundColor:'rgba(144, 52, 186, 0.34)',position:'absolute',right:'36%',top:'15%'}}></div>  */}
      <div id='login-child'style={{
      border:"1px solid rgb(123, 120, 120)",
      zIndex:2,
      marginTop:30,
      backgroundColor:'',
      backdropFilter: 'blur(20px)',
      position:'relative',
      display:'flex',
      flexDirection:'column',
      justifyContent:'flex-start',
      alignItems:'center',
      borderRadius:40,
      width:400,
      fontFamily:'roboto',
      height:630,
 boxShadow:'0px 0px 50px rgba(0,0,0,0.3)',
 paddingTop:10,
 marginLeft:'20%',
 marginBottom:30

      }}>
          
        <div>
          <h2 style={{color:'white',marginTop:5,marginBottom:0,fontFamily:'roboto'}}>Sign Up </h2>
          
        </div>
      <div>
      <p style={{color:'white',fontFamily:'roboto'}}>Username</p>
      <input onChange={(e)=>{setUserName(e.target.value)}} value={userName} style={{borderRadius:10, height:30,width:250,paddingLeft:10,paddingTop:2,
        paddingBottom:2,
        
        backgroundColor:'rgb(176, 176, 176,0.1)',color:'white',border:'none'}} type='text' placeholder='Username'/>
    </div>
      <div>
      <p style={{color:'white'}}>Name</p>
      <input onChange={(e)=>{setName(e.target.value)}} value={name} style={{borderRadius:10, height:30,width:250,paddingLeft:10,paddingTop:2,paddingBottom:2,backgroundColor:'rgb(176, 176, 176,0.1)',color:'white',border:'none'}} type='text' placeholder='Name'/>
    </div>
      <div>
      <p style={{color:'white'}}>Email</p>
      <input onChange={(e)=>{setEmail(e.target.value)}} value={email} style={{borderRadius:10, height:30,width:250,paddingLeft:10,paddingTop:2,paddingBottom:2,backgroundColor:'rgb(176, 176, 176,0.1)',color:'white',border:'none'}} type='text' placeholder='Email'/>
    </div>
    <div>
      <p style={{color:'white'}}>Password</p>
      <input onChange={(e)=>{setPassword(e.target.value)}} value={password} style={{borderRadius:10, height:30,width:250,paddingLeft:10,paddingTop:2,paddingBottom:2,backgroundColor:'rgb(176, 176, 176,0.1)',color:'white',border:'none'}} ype='password' placeholder='Password' />
    </div>
    <div>
      <p style={{color:'white'}}>Confirm Password</p>
      <input onChange={(e)=>{setConfirmPassword(e.target.value)}} value={confirmPassword}style={{borderRadius:10, height:30,width:250,paddingLeft:10,paddingTop:2,paddingBottom:2,backgroundColor:'rgb(176, 176, 176,0.1)',color:'white',border:'none'}} ype='password' placeholder='Confirm Password' />
    </div>
    <div>
      <p style={{color:'white'}}>Phone Number</p>
      <input onChange={(e)=>{setPhoneNum(e.target.value)}} value={phoneNum} style={{borderRadius:10, height:30,width:250,paddingLeft:10,paddingTop:2,paddingBottom:2,backgroundColor:'rgb(176, 176, 176,0.1)',color:'white',border:'none'}} type='number' placeholder='91+'/>
    </div>
    <div>
    <button 
    onClick={handleRegister} 
     onMouseEnter={(e)=>{
      e.target.style.backgroundColor='rgb(128, 164, 206)'
    }}
    onMouseLeave={(e)=>{
      e.target.style.backgroundColor='transparent' }}
      style={{
        color:'white',
        backgroundColor:'transparent',
        borderRadius:10, height:40,width:250,
        fontSize:17,
        marginTop:20,
        border:'1px solid rgb(122, 122, 122)',
        cursor:'pointer',
      }}>Register</button>   
       </div>
       
      </div>
      <div style={{ zIndex:3,display: 'flex', alignItems: 'center', margin: '20px 0' }}>
  <span style={{ borderBottom: "1px solid white",color:'white',fontFamily:'roboto',margin: '0 10px' }}> OR</span>
</div>

    <Google/>
    </div>
  )
}

export default Login
