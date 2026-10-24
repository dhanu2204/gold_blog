import React,{useState}from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';

const Login = () => {

  const [email,setEmail]=useState("")
  const [password,setPassword] = useState("")
  const nav = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const res=await fetch(`${import.meta.env.VITE_BACKENDURL}user/auth/login`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          email,password
        })
      })
      if(res.ok)
      {
        const data = await res.json()
        localStorage.setItem("jwttoken",data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userEmail",email)
        toast.success("User Login Successful!")
        nav('/home')
      }
      else{
        const text = await res.text();
        toast.error(text)
      }
    } catch (error) {
      toast.error("Something went wrong!, try again")
      console.log(error)
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
        <h2>Welcome Back</h2>
        <p>Sign in to Dashboard</p>
        <form onSubmit={handleSubmit} className="auth-form">
            <input 
              type="email" 
              className="auth-input"
              placeholder="Email Address"
              value={email} 
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              className="auth-input"
              placeholder="Password"
              value={password} 
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
            <input type="submit" value="Sign In" className="auth-button"/>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to='/register'>Create one</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login