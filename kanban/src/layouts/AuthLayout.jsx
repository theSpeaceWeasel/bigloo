
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthLayout = () => {
    const { user } = useAuth()
    
    // Check authentication status directly without state management
    const isAuthenticated = user && user.id && user.name
    
    return (isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />)
}

export default AuthLayout

