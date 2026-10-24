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

    if (!/^\d{10}$/.test(phonenumber)) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }

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
        toast.error("Phone number already registered");
      } else {
        toast.error(text);
      }
    }
    }
    catch(e) {
      toast.error("Something went wrong! Please try again.");
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

        <input 
          className="auth-input" 
          id="Phone" 
          type="tel" 
          placeholder="Enter 10-digit Phone Number" 
          value={phonenumber} 
          maxLength={10}
          pattern="[0-9]{10}"
          title="Please enter exactly 10 digits"
          onChange={(e)=>setPhonenumber(e.target.value.replace(/\D/g, '').slice(0, 10))} 
          required
        />

        <input className="auth-input" id="Password" type="password" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} required/>

        <input className="auth-button" type="submit" value="Sign Up" />
      </form>
      <div className="auth-footer">Already have an account?<Link to="/login">Sign In</Link></div>
    </motion.div>
    </div>
  )
}

export default Register