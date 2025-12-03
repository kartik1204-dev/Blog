import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast , ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import { addUser } from './blog';
import chill from "./lamp2.jpg"
import pahad from './plain.jpg'
import Google from './Google';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
const Signup = () => {

  const dispatch = useDispatch()
  const Navigate = useNavigate()
    const [ email , setEmail] = useState('')
const[passError,setPassError]=useState(null)
    const [  password, setPassword] = useState(null)
    useEffect(()=>{
if(password && password.length<6)setPassError("Password length must be greater than six")
  else setPassError(false)
    },[password])
    const handleSubmit = async function() {
      try{
        const result =
      await axios.post('http://localhost:3000/login',
        {
        email : email,
      password : password,
        })
   

        console.log(result)
        if(result.data.success)
        {   dispatch(addUser(email))
         localStorage.setItem('token', result.data.token); // store token
            localStorage.setItem("email",email)
            toast.success('Login Successful')
          Navigate('/home')
        }
              }
       catch (err) {
    console.error(err);
  }
    }
  return (
    <div id='main-conatiner' style={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      height:'100vh',
      backgroundColor:'transparent',
      
    }}>
           <GoogleOAuthProvider clientId="547421160715-02jor6h6vf41nd1fm6c4ohbsl977o888.apps.googleusercontent.com">
        <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
</GoogleOAuthProvider>
      <img style={{position:'absolute' ,width:"100vw",
          height:"100vh",}} src={pahad} alt="" />
        <div style={{position:'absolute',height:"100vh",width:"100%",backgroundColor:"rgba(9,52,76,0.7)",zIndex:2,}}> </div>
        {/* <div style={{height:150,width:150,borderRadius:100,backgroundColor:'green',position:'absolute',left:'25%',top:'3%'}}></div>
      <div style={{height:150,width:150,borderRadius:100,backgroundColor:'pink',position:'absolute',right:'25%',top:'3%'}}></div> */}
              <ToastContainer/>

      <div id='child'style={{
        backgroundColor:'',
        backdropFilter:'blur(20px)',
        padding:50,
        display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:40,

      boxShadow:'0px 0px 30px rgb(39, 38, 38)',
      zIndex:2,
      border:"1px solid rgb(146, 143, 143)",
      paddingBottom:-20
      }}>
      <div>
        <h1 style={{display:'inline',color:'white',fontFamily:'roboto'}}>Sign In</h1>
        <p style={{color:'white',fontFamily:'roboto'}}>Not registered yet ? <span onClick={()=>Navigate('/Login')} style={{color:'rgb(128, 164, 206)',cursor:'pointer',fontFamily:'roboto'}}>Sign up</span></p>
      </div>
    <div>
      <p style={{color:'white',fontFamily:'roboto'}}>Email</p>
      <input onChange={(e)=>setEmail(e.target.value)} value={email} style={{borderRadius:10, height:30,width:250,paddingLeft:10,backgroundColor:'transparent',border:'1px solid white',
        color:'white'
      }} type='text' placeholder='Email'/>
    </div>
    <div>
      <p style={{color:'white',fontFamily:'roboto'}}>Password</p>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} style={{borderRadius:10, height:30,width:250,paddingLeft:10,
        backgroundColor:'transparent',border:'1px solid white',color:'white'}} type='password' placeholder='Password' />
    </div>
{
  passError !=null &&
  <div style={{ fontFamily:'roboto',width:'100%',display:'flex',justifyContent:'flex-start',marginLeft:140}}> <p style={{color:'red',fontSize:12}}>{passError}</p> 
  </div>
}
    <div>
      <button onClick={()=>handleSubmit()}
onMouseEnter={(e)=>{
  e.target.style.backgroundColor= "rgb(128, 164, 206)"

}}
onMouseLeave={(e)=>{
  e.target.style.backgroundColor='transparent'
}}
      style={{
        color:'white',
        backgroundColor:'transparent',
        border:'none',
        boxShadow:'0px 0px 3px rgba(160, 160, 160, 0.3)',
        fontFamily:'roboto',
        borderRadius:10, height:40,width:250,
        fontSize:17,
        
        cursor:'pointer'
      }}>Login </button>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid white' }} />
  <span style={{ color:'white',fontFamily:'roboto',margin: '0 10px' }}>or</span>
  <hr style={{ width:200,flex: 1, borderTop: '1px solid white' }} />
</div>

    <Google/>

      </div>

    </div>
    
  )
}

export default Signup
