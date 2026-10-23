import React from 'react'
import {useNavigate} from 'react-router-dom'

const ProtectedRoutes = ({children}) => {

    const nav = useNavigate()
    const token = localStorage.getItem('jwttoken');
    if(!token)
    {
        return <Navigate to = "/login" />
    }
  return children;
}

export default ProtectedRoutes