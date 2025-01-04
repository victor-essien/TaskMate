import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContex'

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
    const {user} = useAuth();

    console.log('fromportotecte', user)


    if(!user) {
        return <Navigate to={"/"} />
    }

    return children;
}


export default ProtectedRoute;