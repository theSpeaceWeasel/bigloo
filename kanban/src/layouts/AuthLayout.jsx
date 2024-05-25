
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthLayout = () => {
    const { user } = useAuth()
    // console.log(user);
    return (Object.keys(user).length && user.name ? < Outlet /> : <Navigate to="/login" replace />)
}

export default AuthLayout

