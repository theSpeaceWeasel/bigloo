
import Lottie from "react-lottie";
import loadinganimation from "../assets/home-animation.json"
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import SweetAlert from 'react-bootstrap-sweetalert';






const Home = () => {

  const [searchParams] = useSearchParams();
  const verifyEmailToken = decodeURIComponent(searchParams.get("verify-token")) || "";
  const { setUser } = useAuth()
  console.log(verifyEmailToken);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadinganimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const verifyEmail = async () => {
      if (verifyEmailToken !== "") {
        try {
          const response = await axios.post('/api/verify-email', { token: verifyEmailToken });
          if (response.data.user) {
            setUser(response.data.user);
            toast.success("Account Verified!", {
              position: "top-right",
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            });
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
        }
      }
    };

    verifyEmail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps


  return (
    <div>
      <Lottie
        options={defaultOptions}
        style={{ marginLeft: "10rem" }}
        height={400}
        width={400}
      />
      <ToastContainer />

    </div>
  )
}

export default Home
