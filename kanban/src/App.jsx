import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Tickets from "./pages/Tickets";
import TicketPage from "./pages/TicketPage";
import Dashboard from "./Home/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import GuestLayout from './layouts/GuestLayout';
// import Test from './Home/Test';



function App() {

  return (
    <>
      <div className='app'>

        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <Routes>

              <Route element={<AuthLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/ticket/:ticketId' element={<Dashboard />} />
                <Route path='/tickets' element={<Tickets />} />
                <Route path='/add-ticket' element={<TicketPage />} />
                {/* <Route path='/ticket/:id' element={<TicketPage editmode />} /> */}
              </Route>

              <Route element={<GuestLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<SignUp />} />
              </Route>

            </Routes>
          </AuthProvider>

        </BrowserRouter>
      </div>
    </>
  )
}

export default App
