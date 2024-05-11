import logo from "../images/—Pngtree—business logo design free logo_915991.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav>
      <div className="logo-container">
        <img style={{ height: "70px", padding: "15px" }} src={logo} alt="logo" />
      </div>
      <div className="controls-container">

        {Object.keys(user)?.length ? (
          <>
            <Link to={"/"}>Home</Link>
            <Link to="/tickets">Tickets</Link>
            <div className="icon" onClick={() => navigate('/add-ticket')}>➕</div>
            <div className="icon" style={{ fontSize: "40px" }} onClick={() => navigate('/tickets')}>←</div>
            <button className="logout" onClick={() => logout()}>Logout</button>

          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar