import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';

const Register = () => {

  const [name,setName] = useState("")
  const [phonenumber,setPhonenumber] = useState("")
  const [password,setPassword] = useState("")
  const nav = useNavigate()
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}user/auth/register`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({name,phonenumber,password})
    })

    if(res.ok)
    {
      toast.success('User registered sucessfuly')
      nav('/login')
    }
    else 
    {
      const text = await res.text();
      if(text.includes("already")) {
        alert("Phone number already registered");
      } else {
        alert("Error: " + text);
      }
    }
    }
    catch(e) {
    alert("Something went wrong! Please try again.");
    console.error(e);
}

  }
  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      <h2>Welcome</h2>
      <p>Register to see the best jewels</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <input className="auth-input" id="Name" type="text" placeholder="Enter full Name" value={name} onChange={(e)=> setName(e.target.value)} required/>

        <input className="auth-input" id="Phone" type="tel" placeholder="Enter your Phone Number" value={phonenumber} onChange={(e)=>setPhonenumber(e.target.value)} required/>

        <input className="auth-input" id="Password" type="password" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} required/>

        <input className="auth-button" type="submit" value="Sign Up" />
      </form>
      <div className="auth-footer">Already have an account?<Link to="/login">Sign In</Link></div>
    </motion.div>
    </div>
  )
}

export default Register