/* eslint-disable react/prop-types */
import Avatar from "./Avatar";
import Priority from "./Priority";
import Progress from "./Progress";

import http from "../api/axios"
// import DeleteBlock from "./DeleteBlock";
import { Link } from "react-router-dom";
import {
  useGetTicketTasksCompletedQuery,
  useDeleteTicketMutation,
  // useDownloadTicketMutation
} from '../services/ticket';
import Lottie from "react-lottie";
import downloadanimation from "../assets/download-animation.json";
import deleteanimation from "../assets/delete-animation.json";
import downloadingAnimation from "../assets/downloading-animation.json";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";




const TicketCard = ({ ticket }) => {
  const defaultOptionsDownload = {
    loop: true,
    autoplay: true,
    animationData: downloadanimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const defaultOptionsDownloading = {
    loop: true,
    autoplay: true,
    animationData: downloadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const defaultOptionsDelete = {
    loop: true,
    autoplay: true,
    animationData: deleteanimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { cardTaskUpdated, setCardTaskUpdated } = useAuth()

  const [isDownloading, setIsDownloading] = useState(false)

  const { data: tasksStatus = "", refetch: refetchTasksDone } = useGetTicketTasksCompletedQuery(ticket.id, {
    // refetchOnMountOrArgChange: true,
    // Ensure data is refetched on mount
  });
  const [deleteTicket] = useDeleteTicketMutation();
  // console.log(tasksStatus.completed_tasks_count, tasksStatus.total_tasks_count);
  const percentComplete = Math.round((tasksStatus.completed_tasks_count / tasksStatus.total_tasks_count) * 100);
  const handleDeleteTicket = async (ticketId) => {
    try {
      // Call deleteTicket mutation with the ticketId parameter
      await deleteTicket(ticketId);
      // refetch()
      // Handle success, if needed 
    } catch (error) {
      console.error("Error deleting ticket:", error);
      // Handle error, if needed
    }
  };

  const download = async (ticketId) => {
    setIsDownloading(true)
    const response = await http.post(`http://localhost:8000/api/tickets/download-boards-tasks/${ticketId}`, null, {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filename.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
    setIsDownloading(false)

  }

  useEffect(() => {
    if (cardTaskUpdated) {
      setCardTaskUpdated(false)
      refetchTasksDone()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardTaskUpdated])

  return (
    <div className="ticket-card">
      <Link to={`/ticket/${ticket.id}`} id="link">
        <h3>{ticket.title} </h3>
        <h5>{ticket.description}</h5>
        <Avatar ticket={ticket} />
        <Priority priority={ticket.priority} />
        <Progress progress={percentComplete} />
      </Link>
      <div className="tickets-action-btn" onClick={() => handleDeleteTicket(ticket.id)}>
        <div className="delete-block">
          <div className="download-icon">
            <Lottie
              options={defaultOptionsDelete}
              // style={{ marginRight: "100px" }}
              height={30}
              width={30}
            />
          </div>
        </div>
      </div>
      <div className="tickets-action-btn" onClick={() => { download(ticket.id) }}>
        <div className="delete-block">
          <div className="download-icon">
            {isDownloading ? <Lottie
              options={defaultOptionsDownloading}
              // style={{ marginRight: "100px" }}
              height={40}
              width={40}
            /> : <Lottie
              options={defaultOptionsDownload}
              // style={{ marginRight: "100px" }}
              height={40}
              width={40}
            />}
          </div>
        </div>
      </div>
      {/* <DeleteBlock deleteTicket={deleteTicket} /> */}
    </div>
  )
}

export default TicketCard