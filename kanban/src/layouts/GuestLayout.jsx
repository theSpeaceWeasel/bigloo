/* eslint-disable react-hooks/exhaustive-deps */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GuestLayout = () => {
    const { user } = useAuth()
    
    // Check guest status directly without state management
    const isGuest = !user || !user.id || !user.name
    
    return (isGuest ? <Outlet /> : <Navigate to="/" replace />)
}

export default GuestLayout
