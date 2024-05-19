/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext([]);

export const AuthProvider = ({ children }) => {
    const [logging, setLogging] = useState(false)
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {};
    });



    const [ticketHasBeenPosted, setTicketHasBeenPosted] = useState(false)
    const [cardTaskUpdated, setCardTaskUpdated] = useState(false)

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const { data } = await axios.get('/api/user')
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            if (error.response.status === 401) navigate("/login");
        }

    }

    const login = async (data) => {
        setLogging(true)
        await csrf()
        try {
            await axios.post('/login', data);
            await getUser();
            setLogging(false)
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    const signup = async (data) => {
        setLogging(true)
        await csrf();
        try {
            await axios.post('/register', data);
            await getUser();
            setLogging(false)
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    const logout = () => {
        axios.post('/logout').then(() => setUser({}))
        localStorage.removeItem('user');
        navigate("/login")
    }

    return <AuthContext.Provider value={{
        user,
        csrf,
        login,
        logging,
        signup,
        getUser,
        logout,
        ticketHasBeenPosted,
        setTicketHasBeenPosted,
        cardTaskUpdated,
        setCardTaskUpdated,
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
