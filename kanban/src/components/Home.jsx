import Lottie from "react-lottie";
import loadinganimation from "../assets/home-animation.json"


const Home = () => {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadinganimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  return (
    <div>
      <Lottie
        options={defaultOptions}
        style={{ marginLeft: "10rem" }}
        height={400}
        width={400}
      />
    </div>
  )
}

export default Home
