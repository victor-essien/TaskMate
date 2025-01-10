import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContex'

const ProtectedRoute: React.FC = () => {
    const {user} = useAuth();
    const storedUser = localStorage.getItem("user");
    

    console.log('fromportotecte', user)


    // If user is authenticated, render the child routes, otherwise redirect to "/"
  return user ? <Outlet /> : <Navigate to="/" />;
}


export default ProtectedRoute;