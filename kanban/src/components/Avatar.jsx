/* eslint-disable react/prop-types */
import placeholder from '../assets/landscape-placeholder.svg';



const Avatar = ({ ticket }) => {
  console.log(ticket.logo);
  return (
    <div className="avatar-container">
      <div className="image-container">
        <img src={ticket.logo ?? placeholder} alt="" />
      </div>
    </div>
  )
}

export default Avatar;