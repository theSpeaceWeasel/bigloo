/* eslint-disable react-hooks/exhaustive-deps */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// import { useEffect } from 'react'

const GuestLayout = () => {
    const { user } = useAuth()
    return (!Object.keys(user).length && !user.name ? < Outlet /> : <Navigate to="/" replace />)
}

export default GuestLayout
