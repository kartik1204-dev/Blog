import React, { useState } from 'react'
import blog from './bnda.png'
import { useNavigate } from 'react-router-dom'
import bubble from './bubble.mp4'
import diamond from './diamond.mp4'
import box from './box.mp4'
const App = () => {
  const [ hover , setHover]=useState([false,false,false,false,false])
  const [getHover , setGetHover]=useState(false)
  const [readHover , setReadHover]=useState(false)
  const navigate = useNavigate()
  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-betweeen',height:'100vh'}}>
     <div style={{display:'flex', }}>
     <video autoPlay={true} muted={true} loop={true} style={{zIndex:1,position:'absolute',width:"100vw",opacity:0.2}} src={box}/>
     <div style={{position:'absolute', width:"100vw",height:"100vh",backgroundColor:'rgb(10, 28, 48)'}}></div>
      <div style={{display:'flex',justifyContent:'space-between',zIndex:1,
        width:'100vw',paddingLeft:100,
        paddingRight:40
        ,alignItems:'center'
        }} id='medium'>
      <h1 style={{color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Blog's</h1>

    
      <div id='sign-in'style={{display:'flex',gap:50,alignItems:'center',width:'40%',zIndex:1}}>
       <div>
       <p 
       onMouseEnter={()=>setHover([true,false,false,false,false])
       }
      onMouseLeave={()=>setHover([false,false,false,false,false])}
        style={{margin:0,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}
        onClick={()=>navigate("/about")}
        >About</p>
       <div  style={{transition:"width 0.3s ease-in-out",backgroundColor:'white',height:'1.5px',width: hover[0]?"45px":"0px"}}></div>
       </div>
       <div>
       <p 
       onMouseEnter={()=>setHover([false,true,false,false,false])
       }
      onMouseLeave={()=>setHover([false,false,false,false,false])}
        style={{margin:0,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Membership</p>
       <div  style={{transition:"width 0.3s ease-in-out",backgroundColor:'white',height:'1.5px',width: hover[1]?"90px":"0px"}}></div>
       </div>
       <div>
       <p 
       onClick={()=>navigate("/signup")}
       onMouseEnter={()=>setHover([false,false,true,false,false])
       }
      onMouseLeave={()=>setHover([false,false,false,false,false])}
        style={{margin:0,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Write</p>
       <div  style={{transition:"width 0.3s ease-in-out",backgroundColor:'white',height:'1.5px',width: hover[2]?"40px":"0px"}}></div>
       </div>
      
        <button 
        onMouseEnter={()=>setGetHover(true)}
        onMouseLeave={()=>setGetHover(false)}
        onClick={()=>navigate('/Signup')} 
        style={{borderRadius:10,cursor:'pointer', backgroundColor: getHover ?'rgb(128, 164, 206)':'transparent',border:'1px solid white',color:'white',height:'50%',width:'30%',padding:10}}>
          Get started
        </button>
      </div>
      </div>
     </div>

     <div id='parent-div' style={{display:'flex',flexDirection:'row',zIndex:1,justifyContent:'space-between',alignItems:'center',height:'100vh'}}>
      <div id='child-div' style={{display:'flex',flexDirection:'column',zIndex:1,height:500, width:'50%',alignItems:'center',justifyContent:'center',}}>
      <div style={{lineHeight:0.5,display:'flex',flexDirection:'column',alignItems:'center'}}>
      <h1 style={{color:'white',fontFamily:'roboto'}}>
      Human 
      </h1>
      <h1 style={{color:'white',fontFamily:'roboto'}}> Stories & Ideas</h1>
      </div>
      <p style={{color:'white',fontFamily:'roboto'}}> A place to read, write, and deepen your understanding</p>
      <button
      onMouseEnter={()=>setReadHover(true)}
      onMouseLeave={()=>setReadHover(false)}
      onClick={()=>navigate("/signup")}
      style={{borderRadius:10,color:'white', height:20,width:150,padding:20,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'roboto', backgroundColor: readHover ?'rgb(128, 164, 206)':'transparent',border:'1px solid white'}}>Start reading</button>
      </div>
      <img style={{zIndex:1,marginRight:130}}src={blog}/>
     </div>
    
    <div id='footer'style={{paddingTop:25,paddingBottom:25, position:'relative',display:'flex',zIndex:2,justifyContent:'center',gap:30,backgroundColor:'rgb(9, 52, 76)'}}>
      <p onClick={()=>navigate("/help")} style={{fontWeight:700,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Help</p>
      <p onClick={()=>navigate("/about")} style={{fontWeight:700,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>About</p>
      <p onClick={()=>navigate("/privacy")} style={{fontWeight:700,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Privacy Policy</p>
      <p onClick={()=>navigate("/condition")} style={{fontWeight:700,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Term & Condition</p>
      <p  onClick={()=>navigate("/contact")} style={{fontWeight:700,cursor:'pointer',color:'rgb(128, 164, 206)',fontFamily:'roboto'}}>Contact Us</p>

      

     </div>

    </div>
  )
}

export default App
